from rest_framework import serializers
from .models import NewUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=NewUser
        fields = ['user_id','name','gender','age','contact','email','id_type','id_number','pass_type','days_eligible']
        