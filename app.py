from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
import json
import jwt
from datetime import datetime, timedelta
import hashlib


app = Flask(__name__)
CORS(app, resources={r"/*" : {"origins":"*"}})
secret = "wifiDataset123456"
salt = "pwdHasher"
app.config["MONGO_URI"] = "mongodb://localhost:27017/wifiFeedback"
mongo = PyMongo(app)

# To run the Flask app
app.run(port=8000, debug=True)


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