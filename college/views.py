from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import json
import datetime
import jwt
import uuid
# from simplecrypto import encrypt, decrypt
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db import connection

from . models import Colleges, Events
from . serializers import EventSerializer

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
def getColleges(request):
    clgs = Colleges.objects.all()
    data = serializers.serialize('json', clgs)
    return HttpResponse(data, content_type="application/json")


@api_view(['POST'])
def postEvent2(request):
    print(request.data)
    cRef = Colleges.objects.get(
        pk=request.data["cid"], clgName=request.data["cName"])
    event = Events(Cref=cRef)
    Tosend = {}
    Tosend["EventName"] = request.data["eName"]
    Tosend["EventDate"] = request.data["eDate"]
    serializer = EventSerializer(event, data=Tosend)
    if(serializer.is_valid()):
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['POST'])
def postEvent(request):
    with connection.cursor() as cursor:
        cursor.execute(
            "Insert into Events (EventName, EventDate, Cref_id) values (\"%s\", \"%s\", \"%s\")" % (request.data["eName"], request.data["eDate"], request.data["cid"]))
        # ls = dictfetchall(cursor)
        data = serializers.serialize('json', cursor)
        return HttpResponse(data, content_type="application/json")
        # return HttpResponse(json.dumps(ls, default=dateObjectConv), content_type="application/json")


@api_view(['GET'])
def getEvents2(request):

    query = Events.objects.raw(
        'Select Events.EventName, Events.EventDate, Events.id, Colleges.clgName, Colleges.clgAdd from Events, Colleges where Colleges.id = Events.Cref_id')

    data = serializers.serialize('json', query)
    return HttpResponse(data, content_type="application/json")


@api_view(['GET'])
def getEvents(request):
    with connection.cursor() as cursor:
        cursor.execute(
            "Select Events.EventName, Events.EventDate, Events.id, Colleges.clgName, Colleges.clgAdd from Events, Colleges where Colleges.id = Events.Cref_id")
        ls = dictfetchall(cursor)
        return HttpResponse(json.dumps(ls, default=dateObjectConv), content_type="application/json")


@api_view(['POST'])
def collegeLogin(request):
    if not request.data:
        return Response({'Error': "Please provide email/password"}, status="400")

    email = request.data['email']
    rawPass = request.data['password']
    try:
        clg = Colleges.objects.get(email=email)
    except Colleges.DoesNotExist:
        return Response({'Error':  "password"}, status="400")
    if clg:
        if(check_password(rawPass, clg.password)):

            payload = {
                'id': clg.id,
                'email': clg.email
            }

            jwt_token = {}
            jwt_token['token'] = jwt.encode(
                payload, "BCD086C6724307FCCA9CEE9C58A279CF")
            return Response({'token':  jwt_token['token']}, status="200")
            # return HttpResponse(json.dumps(jwt_token), status=200, content_type="application/json")
        else:
            return HttpResponse(json.dumps({'Error': "Invalid credentials"}), status=400, content_type="application/json")


@api_view(['POST'])
def collegeRegister(request):
    if not request.data:
        return Response({'Error': "Please provide email/password"}, status="400")

    email = request.data['email']
    rawPass = request.data['password']
    # password = encrypt(rawPass, "SecretKey")
    password = make_password(rawPass)
    try:
        clg = Colleges.objects.get(email=email)
        print(clg)
    except Colleges.DoesNotExist:

        uniqueId = uuid.uuid4()
        uniqueId = str(uniqueId)
        Colleges.objects.create(email=email, password=password, id=uniqueId)
        payload = {
            'id': uniqueId,
            'email': email
        }

        jwt_token = {}
        jwt_token['token'] = jwt.encode(
            payload, "BCD086C6724307FCCA9CEE9C58A279CF")
        return Response({'token':  jwt_token['token']}, status="200")
        # return HttpResponse(json.dumps(jwt_token), status=200, content_type="application/json")
    if clg:
        return Response({'Error': "Provided email already in Use.."}, status="400")
