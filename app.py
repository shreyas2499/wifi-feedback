from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
import json
import jwt
from datetime import datetime, timedelta
import hashlib
import numpy as np
import pandas as pd


app = Flask(__name__)
CORS(app, resources={r"/*" : {"origins":"*"}})
secret = "wifiDataset123456"
salt = "pwdHasher"
app.config["MONGO_URI"] = "mongodb://localhost:27017/wifiFeedback"
mongo = PyMongo(app)



# Constants
STATUS_MESSAGE = "message"
STATUS = 'STATUS'

@app.route('/login', methods=["POST"])
def userLogin():
    res_data = {}    
    try:
        data = json.loads(request.data)
        userEmail = data["email"]       
        loggedUser = mongo.db.users.find_one({"email":userEmail})
        admin = loggedUser["admin"]

        if loggedUser:
            password = data["password"] + salt
            password = hashlib.md5(password.encode("utf-8"))
            password = password.hexdigest()
            if loggedUser['password'] == password:
                
                time = datetime.utcnow() + timedelta(hours=24)
                token = jwt.encode({
                        "user": {
                            "email": f"{loggedUser['email']}",
                        },
                        "exp": time
                    },secret)
                
                message = f"User authenticated"
                code = 200
                status = "successful"
                res_data['token'] = token.decode('utf-8')
                res_data["email"] = userEmail
                res_data["admin"] = admin
        return jsonify({STATUS: status, "data": res_data, STATUS_MESSAGE:message}), code
    except Exception as e:
        print("Exception is: ", e)

    return jsonify({STATUS: "unsucessfull", "data": res_data, STATUS_MESSAGE:"User auth failed"}), 500


@app.route('/allUsers', methods=["GET"])
def getAllUsers():
    projectionQuery = {"email":1, "_id":0}
    userList = []
    try:
        for email in mongo.db.users.find({}, projectionQuery):
            userList.append(email["email"])
        return jsonify({STATUS_MESSAGE:"List of users", "users": userList}), 200
    
    except Exception as e:
        print(e)
    
    return jsonify({STATUS_MESSAGE:"Fetching user list failed"}), 500


@app.route('/signup', methods=["POST"])
def signUp():
    try:
        data = json.loads(request.data)
        userEmail = data["email"]

        
        loggedUser = mongo.db.users.find_one({"email":userEmail})
        if loggedUser:
            return jsonify({STATUS_MESSAGE: "User already present"}), 500
        
        seqQues = data["seqQues"]
        password = data["password"] + salt
        hashed = hashlib.md5(password.encode("utf-8"))
        hashedPassword = hashed.hexdigest()
        admin = data.get("admin", False)

        add_user = {
            "email": userEmail,
            "password": hashedPassword,
            "seqQues": seqQues,  # dict -> {Q: "asdasd", A: "asdasdad"}
            "admin": admin
        }

        mongo.db.users.insert_one(add_user)

        return jsonify({STATUS_MESSAGE: "User signed up"}), 200
    except Exception as e:
        print("Unsucessfull user creation", e)

    return jsonify({STATUS_MESSAGE: "User not created"}), 500


@app.route("/resetPassword", methods=["PUT"])
def resetPassword():
    data = json.loads(request.data)
    newPassword = data["password"]
    email = data["email"]
    newPassword = newPassword + salt
    hashed = hashlib.md5(newPassword.encode("utf-8"))
    hashedPassword = hashed.hexdigest()
    
    query = {"email" : email}
    update = {"$set" : {"password": hashedPassword}}

    try:
        mongo.db.users.update_one(query, update)
        return jsonify({STATUS_MESSAGE: "Password updated"}), 200
    except Exception as e:
        print(e)
        return jsonify({STATUS_MESSAGE: "Password update failed"}), 500
    




# Review related APIs

@app.route("/addReview", methods=["POST"])
def add_review():
    data = json.loads(request.data)

    review = data["review"]
    wifiName = data["name"]
    wifiID = data["wifiID"]
    user = data["user"]
    lat = data.get("lat", False)
    long = data.get("long", False)
    provider = data["provider"]
    borough = int(data["borough"])    # Assuming Borough ID is getting passed.


    try:
        review_data = {
            "review": review,
            "datetime": datetime.today(),
            "user": user
        }
        query = {"wifiID":wifiID, "Borough": borough, "Provider": provider, "Name": wifiName}
        update = {"$addToSet": {"Reviews": review_data}}

        mongo.db.wifiList.update_one(query, update, upsert=True)
    
        return jsonify({STATUS_MESSAGE: "Review added"}), 200
    except Exception as e:
        print(e)

    return jsonify({STATUS_MESSAGE: "Adding of review failed"}), 500


@app.route("/getReviews", methods=["GET"])
def get_reviews():
    data = json.loads(request.data)

    wifiID = data["wifiID"]
    wifiName = data["name"]
    provider = data["provider"]
    borough = int(data["borough"])    # Assuming Borough ID is getting passed.

    try:
       
        query = {"wifiID": wifiID, "Borough": borough, "Provider": provider, "Name": wifiName}
        projectionQuery = {"Reviews":1, "_id":0}

        reviewList = mongo.db.wifiList.find_one(query, projectionQuery)

        return jsonify({STATUS: "Review Comments", "data": reviewList}), 200
    except Exception as e:
        print(e)

    return jsonify({STATUS_MESSAGE: "Review fetch failed"}), 500



# Wifi Related APIs

@app.route("/getWifiList", methods=["GET"])
def get_wifi():
    # Provider
    # Borough Name

    data = json.loads(request.data)

    provider = data.get("provider", False)
    borough = data.get("boroughName", False)

    query = {}
    if(provider):
        query["Provider"] = provider
    elif(borough):
        query["Borough Name"] = borough
    

    projectionQuery = {"_id":0} # Add projections based on what is required 

    try: 
        wifis = mongo.db.wifiList.find(query, projectionQuery)
        return jsonify({STATUS: "List of Wifis", "data": list(wifis)}), 200

    except Exception as e:
        print(e)
        return jsonify({STATUS_MESSAGE: "Wifi fetch failed"}), 500


@app.route("/addWifi", methods=["POST"])
def add_wifi():
    data = json.loads(request.data)

    admin = data.get("admin", False)   # Get this value from the decoded token


    # UPDATE THIS DEPENDING ON WHAT VALUES ARE REQUIRED IN THE FRONTEND
    if admin:
        # Add wifi ID here
        wifiName = data["name"]
        lat = data.get("lat", False)
        long = data.get("long", False)
        provider = data["provider"]
        borough = int(data["borough"])    # Assuming Borough ID is getting passed.
        boroughName = data["boroughName"]

        try: 
            query = {
                "Provider":provider,
                "Name": wifiName,
                "Latitude": lat,
                "Longitude": long,
                "Borough": borough,
                "Borough Name": boroughName,
                "Activated": datetime.today()
            }
            mongo.db.wifiList.insert_one(query)
            return jsonify({STATUS: "Wifi Added Successfully"}), 200

        except Exception as e:
            print(e)
            return jsonify({STATUS_MESSAGE: "Wifi Not added"}), 500

    else:
        return jsonify({STATUS_MESSAGE: "User doesn't have permission to add Wifis"}), 401




# Adding the dataset to DB

# Run this only once manually
@app.route("/insertValues", methods=["POST"])
def insert_values():
    df = pd.read_csv("wifi.csv")    

    df = df.reset_index()  # make sure indexes pair with number of rows
    wifiData = []
    for index, row in df.iterrows():
        res = {
            "wifiID": str(row["OBJECTID"]),
            "borough": str(row["Borough"]),
            "type": row["Type"],
            "provider": row["Provider"],
            "wifiName": row["Name"],
            "location": str(row["Location"]),
            "latitude": str(row["Latitude"]),
            "longitude": str(row["Longitude"]),
            "x": str(row["X"]),
            "y": str(row["Y"]),
            "locationT": row["Location_T"],
            "remarks": row["Remarks"],
            "city": row["City"],
            "ssid": str(row["SSID"]),
            "sourceID": str(row["SourceID"]),
            "activated": datetime.strptime(row["Activated"], "%m/%d/%Y"),
            "boroCode": str(row["BoroCode"]),
            "boroughName": row["Borough Name"],
            "ntaCode": str(row["Neighborhood Tabulation Area Code (NTACODE)"]),
            "nta": str(row["Neighborhood Tabulation Area (NTA)"]),
            "councilDistrict": str(row["Council Distrcit"]),
            "postcode": str(row["Postcode"]),
            "boroCD": str(row["BoroCD"]),
            "censusTract": str(row["Census Tract"]),
            "BCTCB2010": str(row["BCTCB2010"]),
            "bin": str(row["BIN"]),
            "bbl": str(row["BBL"]),
            "doittID": str(row["DOITT_ID"]),
            "coordinates": str(row["Location (Lat, Long)"])
        }

        wifiData.append(res)

        mongo.db.wifiList.insert_one(res)

    return jsonify({STATUS: "Wifi Added Successfully to Database"}), 200


if __name__ == "__main__":
    # To run the Flask app
    app.run(port=8000, debug=True)
