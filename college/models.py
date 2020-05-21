from django.db import models


class Colleges(models.Model):

    class Meta:
        db_table = "Colleges"  # specifying Table Name

    email = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=100)
    clgName = models.CharField(max_length=50)
    clgAdd = models.CharField(max_length=50)
    id = models.CharField(primary_key=True, max_length=100)

    def __str__(self):
        return self.email


class Events(models.Model):

    class Meta:
        db_table = "Events"  # specifying Table Name

    EventName = models.CharField(max_length=30)
    EventDate = models.DateField()
    id = models.AutoField(primary_key=True)
    Cref = models.ForeignKey(Colleges, on_delete=models.CASCADE)

    def __str__(self):
        return self.EventName
