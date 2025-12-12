# %%
import pymongo
import dns
from environs import Env

def get_db_connection():
    env = Env()
    db_url = env('DATABASE_URL')
    dbClient = pymongo.MongoClient(db_url)

    return dbClient
