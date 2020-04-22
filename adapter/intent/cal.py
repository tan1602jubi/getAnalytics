import pymongo
import pandas as pd
import json
import payments
from datetime import datetime, timezone, timedelta

def get_macro_info(data, firstMessage, fallbackMessage):
    senders = list(set([i["senderId"] for i in data]))
    avg_msg_per_person =  round(len(data) / len(senders))
    total_unique_user = len(senders)
    avg_time_per_user_count, total_sessions = avg_time_per_user(data, firstMessage)
    unHandeled = 0
    for i in data:
        try:
            if "text" in i["payload"]["output"].keys():
                t = ""
                if isinstance(i["payload"]["output"]["text"], (list)):
                    t = i["payload"]["output"]["text"][0]
                else:
                    t = i["payload"]["output"]["text"]
                if t.strip().lower().startswith(fallbackMessage):
                    unHandeled += 1
        except Exception as er:
            pass
    macro = {
        "Average_Message_Per_Person": str(avg_msg_per_person),
        "Total_Unique_Users": str(total_unique_user),
        "Total_Sessions": str(total_sessions),
        "Average_Time_Per_User": str(round(avg_time_per_user_count/60)) + " min.",
        "Unhandles": str(round((unHandeled/total_sessions * 100), 2)) + " %",
        "Channel": "web"
    }
    return macro



def avg_time_per_user(data, firstMessage):
    c = 0
    total = (len(data))
    total_sessions = 0
    user_avg_time = {}
    for i in data:
        user = i["senderId"]
        if user in user_avg_time.keys():
            if i["payload"]["stages"][0]["text"][0].lower().startswith(firstMessage):
                s = datetime.fromtimestamp(user_avg_time[user]["startTimestamp"]/1000)
                e = datetime.fromtimestamp(user_avg_time[user]['endTimestamp']/1000)
                d = s-e
                user_avg_time[user]["times"].append(d.seconds)
                user_avg_time[user]["startTimestamp"]= i["timestamp"]
                user_avg_time[user]["endTimestamp"]= i["timestamp"]
            else:
                s = datetime.fromtimestamp(user_avg_time[user]["endTimestamp"]/1000)
                e = datetime.fromtimestamp(i["timestamp"]/1000)
                d = s-e
                if d.seconds > 600:
                    total_sessions += 1
                user_avg_time[user]["endTimestamp"] = i["timestamp"]
        else:
            total_sessions += 1
            user_avg_time[user] = {
                "times": [],
                "startTimestamp": i["timestamp"],
                "endTimestamp": i["timestamp"]
            }

    tot_seconds = 0
    t = []
    for i in user_avg_time:
        try:
            tot_seconds += max(user_avg_time[i]["times"])
            t.append(max(user_avg_time[i]["times"]))
        except Exception as er:
            tot_seconds += 0

    return tot_seconds / len(user_avg_time.keys()), total_sessions

def get_journey_session_count(data, intentName, code):
    c = 0
    total = (len(data))
    total_sessions = 0
    lastTimestamp = 0
    got_first = "false"
    users = []
    for i in data:
        if i["conversationId"] == intentName and got_first == "True":# and len(i["payload"]["stages"]) == 1:
            users.append(i["senderId"])
            s = datetime.fromtimestamp(lastTimestamp/1000)
            e = datetime.fromtimestamp(i["timestamp"]/1000)
            d = s-e
            if d.seconds > 600:
                total_sessions += 1
            lastTimestamp = i["timestamp"]
        else:
            if i["conversationId"] == intentName:# and len(i["payload"]["stages"]) == 1:
                users.append(i["senderId"])
                total_sessions += 1
                got_first = "True"
                lastTimestamp = i["timestamp"]
    return total_sessions, str(len(list(set(users))))


def get_faq_data(data, total_sessions):
    faq = [i["payload"]["stages"][0]["text"][0]+"$||$"+i["conversationId"] for i in data if len(i["payload"]["stages"]) == 1]# and i["conversationId"].startswith("st_")]
    # faqs = [{"Name": i.split("$||$")[1], "faq": i.split("$||$")[0],"freq": faq.count(i), "sessions": get_journey_session_count(data, i.split("$||$")[1])}  for i in list(set(faq))]
    faqs = []

    for i in list(set(faq)):
        if not i.split("$||$")[1] == "":
            ss, unique_users = get_journey_session_count(data, i.split("$||$")[1], "faq")
            rec = {
                "Name": i.split("$||$")[1], 
                "faq": i.split("$||$")[0],
                "freq": faq.count(i), 
                "sessions": str(round((ss / total_sessions * 100), 2)) + " %",
                "users": unique_users
            }
            faqs.append(rec)

    return faqs

def get_journey_data(data, total_sessions):
    jcs = list(set([i["conversationId"] for i in data if len(i["payload"]["stages"]) > 1])) # ['rolloverpolicy', 'servicingNetworkGarage', 'servicingBranchLocator', 'servicingRenewalNotice', 'renewpolicy', 'newtwpolicyrename', 'quotegenrollover', 'servicingPolicyPDFCopy', 'servicingNetworkHospital']

    jdata = [i for i in data if i["intentName"] in jcs]
    journey_metadata = {}
    for i in jdata:
        if i["conversationId"] in journey_metadata.keys():
            pass
        elif len(i["payload"]["stages"]) > 2:
            journey_metadata[i["conversationId"]] = {}
            journey_metadata[i["conversationId"]]["stages"] = [{"name": stage["stage"], "count": 0} for stage in i["payload"]["stages"]] #{stage["stage"]: 0 for stage in i["payload"]["stages"]}
            ss, unique_users = get_journey_session_count(data, i["conversationId"],"journey")
            journey_metadata[i["conversationId"]]["sessions"] = ss#str(round(((ss / total_sessions) * 100), 2)) + " %"
            journey_metadata[i["conversationId"]]["sessionPercent"] = str(round(((ss / total_sessions) * 100), 2)) + " %"
            journey_metadata[i["conversationId"]]["users"] = unique_users

    for i in data:
        intent = i["conversationId"]
        cuerrent_stage = int(i["tracker"])
        stage = i["payload"]["stages"][cuerrent_stage]["stage"]
        try:
            journey_metadata[intent]["stages"][cuerrent_stage]["count"] += 1
        except Exception as er:
            pass
    return journey_metadata

def getTimeStamp(date):
    end = datetime.strptime(date["to"].replace("-", "/"), '%Y/%m/%d')
    end += timedelta(days=1)
    end = str(end.date())
    start = datetime.strptime(date["from"].replace("-", "/"), '%Y/%m/%d')
    start = str(start.date())
    dt_to = datetime(int(end.split("-")[0]), int(end.split("-")[1]), int(end.split("-")[2]))
    timestamp_to = int(str(dt_to.replace(tzinfo=timezone.utc).timestamp()).split(".")[0] + "000")
    dt_from = datetime(int(start.split("-")[0]), int(start.split("-")[1]), int(start.split("-")[2]))
    timestamp_from = int(str(dt_from.replace(tzinfo=timezone.utc).timestamp()).split(".")[0] + "000")
    return timestamp_from, timestamp_to

def sort_data(d, sort_by, code):
    list_data = d
    if code == "journey":
        list_data = []
        for i in d:
            rec = {}
            rec = d[i]
            rec["Name"] = i
            list_data.append(rec)
        list_data = sorted(list_data, key = lambda i: i[sort_by], reverse=True)
        for i in list_data:
            i[sort_by] = str(i[sort_by])
    else:
        list_data = sorted(list_data, key = lambda i: i[sort_by], reverse=True)
        for i in list_data:
            i[sort_by] = str(i[sort_by])
    return list_data

def get_report(projectInfo):
# if __name__ == "__main__":

    projectId = projectInfo["projectId"]
    date = projectInfo["date"]
    firstMessage = projectInfo["firstMessage"]
    fallbackMessage = projectInfo["fallbackMessage"]
    fromDate, toDate = getTimeStamp(date)

    m = pymongo.MongoClient('mongodb+srv://sharedParaRead:k07r4FDUpSedawJ6@sharedparramato-sy1qy.mongodb.net/test?retryWrites=true&w=majority')
    db = m.get_database('shared-parramato')
    data = list(db.eventSourceChatSchema.find({"projectId": projectId, "timestamp": {"$gt": int(fromDate), "$lte": int(toDate)}})) 

    macro_data = get_macro_info(data, firstMessage, fallbackMessage)
    faq_data = get_faq_data(data, int(macro_data["Total_Sessions"]))
    journey_data = get_journey_data(data, int(macro_data["Total_Sessions"]))

    return {"marco_data": macro_data, "faq_data": sort_data(faq_data, "freq", "faq"), "journey_data": sort_data(journey_data, "sessions", "journey")}#, "payInfo": payInfo}