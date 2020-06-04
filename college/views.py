from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import datetime
import jwt
import csv
import uuid
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db import connection
from django.conf import settings
from pathlib import Path
from . models import Colleges, Events, CAuth
from . serializers import EventSerializer
from . gmail import main, create_message, send_message
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
channel_layer = get_channel_layer()

# Create your views here.

def dateObjectConv(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.isoformat()


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

@api_view(['GET'])
def CAuthInsert(request):
    script_location = Path(__file__).absolute().parent
    file_location = script_location / 'database.csv'
    with open(file_location) as f:
        reader = csv.reader(f)
        new = 0
        for row in reader:
            ls = row[2].split()
            name = ls[ : - 2]
            cid = ls[-1]
            cid = cid[ :- 1]
            name = ' '.join(name)
            _, created = CAuth.objects.get_or_create( univ=row[1], name=name, state=row[4], city=row[5], id = cid)
            print(cid, created)
    return Response("OVER", status=200)

@api_view(['GET'])
def CAuthCheck(request, cid):
    cid = cid.upper()
    cursor = connection.cursor()
    cursor.execute("Select * from CAuth where id = \"%s\"" %(cid))
    ls = dictfetchall(cursor)
    if len(ls) != 0:
        return Response(ls[0], status=200)    
    else:
        return Response({"error" : "Details for %s not found" %(cid)}, status=200)

@api_view(['GET'])
def AdminLogin(request):
    service = main()
    # print(service)
    EMAIL_FROM = "adm.eveorg@gmail.com"
    EMAIL_TO = "maneeshkoffl@gmail.com, maneeshvijaykar@gmail.com, dhipikha8@gmail.com"
    EMAIL_SUBJECT = 'Hello  from EveOrg!'
    EMAIL_CONTENT = 'Hello, this is a test email..\nEveOrg\nhttps://eve-org.herokuapp.com'

    # Call the Gmail API
    message = create_message(EMAIL_FROM, EMAIL_TO, EMAIL_SUBJECT, EMAIL_CONTENT)
    sent = send_message(service, 'me', message)
    print(sent)
    
    return Response("OVER", status=200)

@api_view(['POST'])
def collegeRegister(request):
    if not request.data:
        return Response({'Error': "Please provide email/password"}, status="400")

    email = request.data['email']
    rawPass = request.data['pass']
    name = request.data['name']
    addr = request.data['addr']

    password = make_password(rawPass)
    try:
        clg = Colleges.objects.get(email=email)
    except Colleges.DoesNotExist:
        uniqueId = uuid.uuid4()
        uniqueId = str(uniqueId)
        Colleges.objects.create(email=email, password=password, id=uniqueId, clgName=name, clgAdd=addr)
        payload = {
            'id': uniqueId,
            'email': email,
            'type': 'clg'
        }

        jwt_token = {}
        jwt_token['token'] = jwt.encode(
            payload, "BCD086C6724307FCCA9CEE9C58A279CF")
        return Response({'token':  jwt_token['token']}, status="200")
        
    if clg:
        return Response({'Error': "Provided email already in Use.."}, status="400")

@api_view(['POST'])
def collegeLogin(request):
    if not request.data:
        return Response({'Error': "Please provide email/password"}, status="400")

    email = request.data['email']
    rawPass = request.data['pass']
    try:
        clg = Colleges.objects.get(email=email)
    except Colleges.DoesNotExist:
        return Response({'Error':  "password"}, status="400")
    if clg:
        if(check_password(rawPass, clg.password)):

            payload = {
                'id': clg.id,
                'email': clg.email,
                'type': 'clg'
            }

            jwt_token = {}
            jwt_token['token'] = jwt.encode(
                payload, "BCD086C6724307FCCA9CEE9C58A279CF")
            return Response({'token':  jwt_token['token']}, status="200")
        else:
            return HttpResponse(json.dumps({'Error': "Invalid credentials"}), status=400, content_type="application/json")

@api_view(['POST'])
def postEvent(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "Insert into Events (EventName, EventDate, Cref_id) values (\"%s\", \"%s\", \"%s\")" % (request.data["eName"], request.data["eDate"], request.data["cid"]))
            data = {}
            data['message'] = "Event Added.."
            async_to_sync(channel_layer.group_send)("event",  {"type": "send.message", "text": "newEvent"})
            return Response(data, content_type="application/json")
    except Exception as e:
        print(e.__class__)
        data = {}
        data['message'] = "Some Error Has Occured"
        return Response(data, status="404", content_type="application/json")

@api_view(['GET'])
def getEvents(request):
    with connection.cursor() as cursor:
        cursor.execute(
            "Select Events.EventName, Events.EventDate, Events.id, Colleges.clgName, Colleges.clgAdd from Events, Colleges where Colleges.id = Events.Cref_id order by Events.EventDate")
        ls = dictfetchall(cursor)
        async_to_sync(channel_layer.group_send)("event",  {"type": "send.message", "text": "Events from Sockets"})
        return HttpResponse(json.dumps(ls, default=dateObjectConv), content_type="application/json")

@api_view(['GET'])
def getColleges(request):
    clgs = Colleges.objects.all()
    data = serializers.serialize('json', clgs)
    return HttpResponse(data, content_type="application/json")
