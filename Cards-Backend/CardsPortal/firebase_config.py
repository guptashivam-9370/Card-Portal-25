import firebase_admin
from firebase_admin import credentials, firestore
from django.conf import settings  # To access settings

# Initialize Firebase
cred = credentials.Certificate(settings.FIREBASE_SERVICE_KEY)
firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()



class NewUserManager:
    @staticmethod
    def save_to_firebase(user):
        data = {
            'user_id': user.id,
            'name': user.name,
            'contact': user.contact,
            'email': user.email,
            'id_type': user.id_type,
            'id_number': user.id_number,
            'pass_type': user.pass_type,
            'days_eligible': user.days_eligible,
            'trans_id': user.trans_id,
        }
        db.collection('verified_users').document(user.id).set(data)