from django.db import models
from django.contrib.auth.models import AbstractUser,AbstractBaseUser,BaseUserManager

# Create your models here.
class NewUserManager(BaseUserManager):
    def create_user(self, email, name, user_id, password=None):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, user_id=user_id)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, user_id, password=None):
        user = self.create_user(email, name, user_id, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
class NewUser(AbstractBaseUser):
    user_id = models.CharField(max_length=5, unique=True) 
    name = models.CharField(max_length=100)
    GENDER=(('M','Male'),('F','Female'),('O','Others'))
    gender=models.CharField(choices=GENDER,default='M',max_length=20)
    age = models.IntegerField()
    contact = models.CharField(max_length=15)
    email = models.EmailField()
    id_choice= (('A','Aadhar Card'),('P','Pan Card'),('C','College ID'))
    id_type = models.CharField(choices=id_choice,default='A',max_length=50)
    id_number = models.CharField(max_length=100)
    passes = (('I','TypeI'),('J','TypeII'),('K','TypeIII'))
    pass_type = models.CharField(choices=passes,default='I',max_length=50)
    days_eligible = models.IntegerField(default=3)

    USERNAME_FIELD = 'user_id'
    REQUIRED_FIELDS = ['email', 'name']

    def __str__(self):
        return self.full_name
