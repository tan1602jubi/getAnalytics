import pymongo
import json
import sys
m = pymongo.MongoClient('mongodb+srv://sharedParaRead:k07r4FDUpSedawJ6@sharedparramato-sy1qy.mongodb.net/test?retryWrites=true&w=majority')
db = m.get_database('shared-parramato')


def getPids(id):
    p = list(db.projectMapper.find())
    pids = [i["projectId"] for i in p]
    if id in pids:
        return "1"
    else:
        return "0" 

if __name__ == "__main__":

    data = json.loads(sys.argv[1])
    if data["operation"] == "chkId":
        print(getPids(data["id"]))


