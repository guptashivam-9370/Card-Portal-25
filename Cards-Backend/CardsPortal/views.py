import json
from django.conf import settings
from django.shortcuts import render,redirect
from django.http import JsonResponse, HttpResponse
from .firebase_config import db,NewUserManager
from .models import NewUser
from rest_framework import status
from django.utils.crypto import get_random_string
import os
from .utils import combine_image_with_qr, get_image_as_base64, convert_multiple_images_to_pdf
from django.conf import settings
import random
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import EmailMessage,BadHeaderError
from .crypto import encrypt as enc,decrypt as dec
from datetime import datetime
from django.core.files.storage import default_storage
users_collection = db.collection('NewUser')

User = get_user_model()

password = 'HailAlcher@2025'
import json

@csrf_exempt 
@api_view(['GET'])
def get_session_data(request):

    session_data = dict(request.session.items())  # Convert session data to a dictionary
    return JsonResponse(session_data)

def create_new_ref_number(passtype):
    while True:
        if passtype == 'Normal':
          new_id = f"NSC{random.randint(100000, 499999)}"
        elif passtype == 'Early':
          new_id = f"ESC{random.randint(100000, 499999)}"

        # Check if the ID already exists in the database
        if not db.collection('NewUser').document(new_id).get().exists:
            return new_id
def Transaction_number():
    while True:
        new_id = f"{get_random_string(length=10)}"
        # Check if the ID already exists in the database
        if not db.collection('NewUser').document(new_id).get().exists:
            return new_id
        
def is_email_exists(email):
    users = db.collection('NewUser').where('email', '==', email).get()
    return len(users) > 0

def home(request):
    return render(request,"main/base.html")

# def encrypt(key,inpString): 
#     for i in range(len(inpString)): 
#         inpString = (inpString[:i] + chr(ord(inpString[i]) ^ ord(key)) + inpString[i + 1:]); 
      
#     return inpString; 

# def decrypt(key,inpString): 
#     for i in range(len(inpString)): 
#         inpString = (inpString[:i] + chr(ord(inpString[i]) ^ ord(key)) + inpString[i + 1:]); 
      
#     return inpString

from .encrypt import encrypt,decrypt
def encryptData(transaction_data):
    modes = {
        'NET BANKING': 'NB',
        'DEBIT CARD': 'DC',
        'CREDIT CARD': 'CC',
        'UPI': 'UPI',
    }
    transaction_id = transaction_data['transaction_id']
    transaction_amount = transaction_data['transaction_amount']
    transaction_mode = 'UPI'
    plain_text = ['1003121','DOM','IN','INR',str(transaction_amount),'NA','https://cardsapi.alcheringa.in/payResp/','https://cardsapi.alcheringa.in/payResp/','SBIEPAY',str(transaction_id),str(transaction_id),str(transaction_mode),'ONLINE','ONLINE']
    concat_string = '|'.join(plain_text)
    return encrypt('V5csjV4nMM8pz6uWaSp1Iw==',concat_string,'SHA256')
    

from .firebase_config import db
import os
from .utils import combine_image_with_qr, get_image_as_base64
from django.conf import settings
from PIL import Image
import zipfile
from io import BytesIO
@csrf_exempt
@api_view(['POST'])
def register(request):
    errors = []
    
    if not all(field in request.data for field in ['total_amount', 'name', 'email', 'gender', 'contact', 'age', 'pass_type']):
        return Response({'message': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

    transaction_id = Transaction_number() 
    transaction_amount = request.data['total_amount']
    # transaction_mode = request.data['payment_mode']
    
    transaction_data = {
        'transaction_id': transaction_id,
        'transaction_amount': transaction_amount,
        'attendees': [],
        'transaction_status': 'pending',
        'transaction_mode': 'UPI',
        'primary_email':request.data['email'][0],
        'email_sent': False,
    }

    attendee_count = len(request.data['name'])
    for i in range(attendee_count):
        name = request.data['name'][i]
        email = request.data['email'][i]
        passtype = request.data['pass_type'][i]

        user_id = create_new_ref_number(passtype)

        attendee_data = {
            'user_id': user_id,
            'name': name,
            'email': email,
            'gender': request.data['gender'][i],
            'contact': request.data['contact'][i],
            'age': request.data['age'][i],
            'id_type': request.data['id_type'][i],
            'id_number': request.data['id_number'][i],
            'pass_type': passtype,
            'transaction_status': 'pending',
        }

        transaction_data['attendees'].append(attendee_data)
        print(transaction_data)

    try:
        db.collection('Transaction').document(transaction_id).set(transaction_data)
        encrypted_data = encryptData(transaction_data)
        print(decrypt('V5csjV4nMM8pz6uWaSp1Iw==',encrypted_data))
        request.session['transaction_data'] = transaction_data
        request.session.modified = True

    except Exception as e:
        errors.append(str(e))
        return Response({'message': 'Error while saving transaction data', 'errors': errors}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if errors:
        return Response({'message': 'Some attendees could not be registered.', 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'EncryptTrans': encrypted_data , 'merchIdVal' : 1003121 , 'txn_id':transaction_id }, status=status.HTTP_201_CREATED)
    # return Response({ 'merchIdVal' : 1000602}, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(['POST'])
def edit_view(request):
    errors=[]
    data = request.data[0]
    try:
       docs = db.collection('Transaction').stream()
       for doc in docs:
           doc_data = doc.to_dict()
           attendees = doc_data.get("attendees",[])
           if attendees:
                first_attendee = attendees[0]
                
                # Extract the relevant fields to compare
                first_attendee_data = {key: first_attendee.get(key) for key in data.keys()}
                
                # Compare the dictionaries
                if first_attendee_data == data:
                    # Delete the document if it matches
                    db.collection('Transaction').document(doc.id).delete()
                    return JsonResponse({
                        "status": "success",
                        "message": "Document deleted successfully.",
                        "document_id": doc.id
                    }, status=200)


              
       return Response({"message":"Working All Good"})
    except:
        errors.append("Notworking ")
        return Response({"message":"Not Working database response"})
   

def summary(request):
    data = dict(request.session.items())
    return render(request,"summary.html",)

def home_view(req):
    return render(req, 'home.html')

def error_view(request):
    return render(request, 'error.html')

def fetch_txn(id):
    try:
        txn_query = db.collection('Transaction').where('transaction_id', '==', id).limit(1).stream()
        txn_data = list(txn_query)

        if not txn_data:
            print(f"Error: No transaction found with the Transaction ID '{id}'")
            return None

        return txn_data[0].to_dict()
    except Exception as e:
        print(f"Error fetching transaction details: {str(e)}")
        return None


def process_card(user_id, card_type, image_filename):
    try:
        print("shivamgupta")
        image_path = os.path.join(settings.STATICFILES_DIRS[0], 'images', image_filename)
        print("shivamgupta")
        if not os.path.exists(image_path):
            print(f"Error: {card_type.capitalize()} image not found at {image_path}")
            return None, None
        pdf_path = f"pdfs/{card_type}_card_{user_id}.pdf"
        pdf_url = f'https://{settings.MINIO_STORAGE_ENDPOINT}/{settings.MINIO_STORAGE_MEDIA_BUCKET_NAME}/{pdf_path}'
        download_url = f'img/card_{user_id}_{card_type}.png'
        download_url = f'https://{settings.MINIO_STORAGE_ENDPOINT}/{settings.MINIO_STORAGE_MEDIA_BUCKET_NAME}/{download_url}'
        if default_storage.exists(pdf_path):
            return download_url, pdf_url
        combined_image_path = combine_image_with_qr(image_path, card_type, user_id)
        print("shivamgupta")
        if not combined_image_path:
            print(f"Error: Failed to generate combined image for {card_type} card")
            return None, None
        print("shivamgupta")

        back_path = 'img/Normal back.png'
        # pdf_path = f"pdfs/{card_type}_card_{user_id}.pdf"
        # pdf_url = f'https://{settings.MINIO_STORAGE_ENDPOINT}/{settings.MINIO_STORAGE_MEDIA_BUCKET_NAME}/{card_type}_card_{user_id}.pdf'
        pdf_generated = convert_multiple_images_to_pdf([combined_image_path,back_path], pdf_path)

        if not pdf_generated:
            print(f"Error: Failed to generate PDF for {card_type} card")
            return None, None

        
        # print(download_url)
        return download_url, pdf_url
    except Exception as e:
        print(f"Error processing {card_type} card: {str(e)}")
        return None, None


def process_normal_card(user_id):
    return process_card(user_id, "normal", "Normal.png")

@csrf_exempt
@api_view(['GET'])
def upload_png_to_media(request):
    file_name = 'Normal.png'
    static_file_path = os.path.join(settings.STATICFILES_DIRS[0], 'images', file_name)
    with open(static_file_path, 'rb') as static_file:
        file_content = static_file.read()
        file_bytes = BytesIO(file_content)
    print(file_bytes)
    if not os.path.exists(static_file_path):
        return JsonResponse({'error': 'File not found in static directory'}, status=404)

    # file_url = f'https://{settings.MINIO_STORAGE_ENDPOINT}/{settings.MINIO_STORAGE_MEDIA_BUCKET_NAME}/{file_name}'

    try:
        image_storage=default_storage

        file_path = image_storage.save(f'imgs/{file_name}', file_bytes)
        print(file_path)
        # with open(static_file_path, 'rb') as static_file:
        #     with open(file_url, 'wb+') as media_file:
        #         media_file.write(static_file.read())
        return JsonResponse({'message': 'File uploaded successfully', 'file_url': file_path}, status=201)
    except Exception as e:
        return JsonResponse({'error': f'Failed to upload file: {str(e)}'}, status=500)
def process_early_card(user_id):
    return process_card(user_id, "early", "early.jpg")

# @csrf_exempt
# @api_view(['GET'])
# def success_view(request):
#     try:
#         txn_id = "OuOYnVajoh"
#         txn_ref = db.collection('Transaction').document(txn_id)
#         txn_doc = txn_ref.get()

#         if not txn_doc.exists:
#             print(f"Transaction not found for ID: {txn_id}")
#             return JsonResponse({'error': 'Transaction not found'}, status=404)

#         txn_details = txn_doc.to_dict()
#         email_sent = txn_details.get('email_sent', False)
#         attendees = txn_details.get('attendees', [])

#         if not txn_details:
#             print(f"Transaction not found for ID: {txn_id}")
#             return JsonResponse({'error': 'Transaction not found'}, status=404)

#         attendees = txn_details.get('attendees', [])
#         if not attendees:
#             print(f"No attendees found in transaction ID: {txn_id}")
#             return JsonResponse({'error': 'No attendees found'}, status=404)

#         print(f"Attendees: {attendees}")

#         processed_cards = []
#         pdf_files = []

#         for attendee in attendees:
#             user_id = attendee.get('user_id')
#             pass_type = attendee.get('pass_type')

#             if not user_id or not pass_type:
#                 print(f"Skipping attendee with missing user_id or pass_type: {attendee}")
#                 continue

#             if pass_type == "Normal":
#                 download_url, pdf_url = process_normal_card(user_id)
#             elif pass_type == "Early":
#                 download_url, pdf_url = process_early_card(user_id)
#             else:
#                 print(f"Unknown pass_type '{pass_type}' for user_id: {user_id}")
#                 continue

#             if download_url and pdf_url:
#                 processed_cards.append({
#                     'user_id': user_id,
#                     'pass_type': pass_type,
#                     'download_url': download_url,
#                     'pdf_url': pdf_url
#                 })

#             pdf_path = os.path.join(settings.MEDIA_ROOT, pdf_url.replace(settings.MEDIA_URL, ""))
#             print(pdf_path)
#             pdf_files.append(pdf_path)

#         if not processed_cards:
#             print("Error: No cards were successfully processed")
#             return JsonResponse({'error': 'No cards were successfully processed'}, status=500)
        
#         if not email_sent:
#             first_attendee = attendees[0]
#             recipient_email = first_attendee.get('email')

#             if recipient_email:
#                 try:
#                     email = EmailMessage(
#                         'Your Passes for Alcheringa',
#                         'Dear attendee, your passes are confirmed. Please find the attached cards.',
#                         settings.DEFAULT_FROM_EMAIL,
#                         [recipient_email],
#                     )

#                     # Attach PDF files to the email
#                     for pdf_file in pdf_files:
#                         email.attach_file(pdf_file)

#                     email.send()
#                     print(f"Email sent successfully to {recipient_email}")

#                     # Update the email_sent flag in the database
#                     txn_ref.update({'email_sent': True})

#                 except Exception as e:
#                     print(f"Error sending email: {str(e)}")
#                     return JsonResponse({'error': 'Failed to send email', 'details': str(e)}, status=500)


#         return JsonResponse({'processed_cards': processed_cards}, status=200)
    

#     except Exception as e:
#         print(f"Error in success_view: {str(e)}")
#         import traceback
#         traceback.print_exc()
#         return JsonResponse({'error': 'Internal server error', 'details': str(e)}, status=500)

@csrf_exempt
@api_view(['GET'])
def success_view(request,txn_id):
    try:
        txn_ref = db.collection('Transaction').document(txn_id)
        txn_doc = txn_ref.get()
        print(txn_doc)
        if not txn_doc.exists:
            print(f"Transaction not found for ID: {txn_id}")
            return JsonResponse({'error': 'Transaction not found'}, status=404)

        txn_details = txn_doc.to_dict()

        if not txn_details:
            print(f"Transaction not found for ID: {txn_id}")
            return JsonResponse({'error': 'Transaction not found'}, status=404)

        transaction_status = txn_details.get('transaction_status', 'pending')
        email_sent = txn_details.get('email_sent', False)
        attendees = txn_details.get('attendees', [])
        if not attendees:
            print(f"No attendees found in transaction ID: {txn_id}")
            return JsonResponse({'error': 'No attendees found'}, status=404)
        
        if transaction_status == 'SUCCESS':
            processed_cards = []
            pdf_files = []

            for attendee in attendees:
                user_id = attendee.get('user_id')
                pass_type = attendee.get('pass_type')
                
                attendee['transaction_status']='SUCCESS'

                if not user_id or not pass_type:
                    print(f"Skipping attendee with missing user_id or pass_type: {attendee}")
                    continue

                if pass_type == "Normal":
                    download_url, pdf_url = process_normal_card(user_id)
                elif pass_type == "Early":
                    download_url, pdf_url = process_early_card(user_id)
                else:
                    print(f"Unknown pass_type '{pass_type}' for user_id: {user_id}")
                    continue

                if download_url and pdf_url:
                    processed_cards.append({
                        'user_id': user_id,
                        'pass_type': pass_type,
                        'download_url': download_url,
                        'pdf_url': pdf_url
                    })
                # print(pdf_path)
                print(pdf_url)
                pdf_files.append(pdf_url)

                verified_user_data = {
                    'user_id': user_id,
                    'name': attendee.get('name'),
                    'email': attendee.get('email'),
                    'contact': attendee.get('contact'),
                    'pass_type': pass_type,
                    'transaction_id': txn_id,
                    'days_entered': [False,False,False],
                    'id_type': attendee.get('id_type'),
                    'id_number': attendee.get('id_number'),
                    'transaction_time' : datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                }

                try:
                    db.collection('verified_users').document(user_id).set(verified_user_data)
                    print(f"Verified user {user_id} added to Firestore.")
                except Exception as e:
                        print(f"Error adding verified user {user_id}: {str(e)}")

            txn_ref.update({'attendees': attendees})
            
            if not processed_cards:
                print("Error: No cards were successfully processed")
                return JsonResponse({'error': 'No cards were successfully processed'}, status=500)
            
            if not email_sent:
                first_attendee = attendees[0]
                back='\n'
                recipient_email = first_attendee.get('email')
                message = f"""
Dear {first_attendee.get('name')},

Thank you for securing your Alcheringa 2025 Card. We're thrilled to welcome you to IIT Guwahati for three days of incredible music, dance, competitions, and fun.

Event Details:

Dates: 31st January to 2nd February
Entry Commences: 31st January, 8am
Fest Conclusion: 2nd February, 11pm

Card Details:
{back.join([f"Name: {user['name']}, ID: {user['user_id']}" for user in attendees])}

Important guidelines:
1. This card entitles Entry for One Person only.
2. Each card has a unique QR code that will be scanned at the gate during entry. Please bring a valid photo ID proof with you for entry.
3. This card grants you one-time entry and one-time exit for the chosen day during the fest.
4. Entry Gates will be closed at 5:00pm.
5. Cards are non-transferable. Each card is valid only for the individual named on the card at the time of purchase.
6. Substance abuse of any kind is strictly prohibited.
7. Vehicles are not allowed inside the campus.
8. Non-campus residents must exit the campus by 11:00 p.m.

Have an unforgettable Alcheringa experience! See you there! ✨

For more information about the event schedule and other details, please visit our official website: https://www.alcheringa.in
Instagram: https://www.instagram.com/alcheringaiitg

Regards,
Team Alcheringa
            """

                if recipient_email:
                    try:
                        email = EmailMessage(
                            'Confirmation and E-Card for Alcheringa 2025!',
                            message,
                            settings.DEFAULT_FROM_EMAIL,
                            [recipient_email],
                        )

                        # Attach PDF files to the email
                        for pdf_url in pdf_files:
                            pdf_path = pdf_url.replace(f'https://{settings.MINIO_STORAGE_ENDPOINT}/{settings.MINIO_STORAGE_MEDIA_BUCKET_NAME}/', '')
                            with default_storage.open(pdf_path, 'rb') as pdf_file:
                                email.attach(f"{pdf_path.split('/')[-1]}", pdf_file.read(), 'application/pdf')

                        email.send()
                        print(f"Email sent successfully to {recipient_email}")

                        # Update the email_sent flag in the database
                        txn_ref.update({'email_sent': True})

                    except Exception as e:
                        print(f"Error sending email: {str(e)}")
                        return JsonResponse({'error': 'Failed to send email', 'details': str(e)}, status=500)


            return JsonResponse({'processed_cards': processed_cards , 'email_id' : txn_details.get('primary_email','hi@gmail.com')}, status=200)
        elif transaction_status == 'FAIL':
            for attendee in attendees:
                attendee['transaction_status'] = 'FAIL'
            txn_ref.update({'attendees': attendees})
            return JsonResponse({'message': 'Transaction failed'}, status=200)
        else: 
            return JsonResponse({'message': 'Transaction pending'}, status=200)

    except Exception as e:
        print(f"Error in success_view: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': str(e)}, status=500)
    
@csrf_exempt 
@api_view(['POST'])
def payResponse(request):
    encData = request.POST.get('encData')
    merchIdVal = request.POST.get('merchIdVal')                   
    Bank_Code = request.POST.get('Bank_Code')
    
    decrypted_text = decrypt("V5csjV4nMM8pz6uWaSp1Iw==",encData)
    print(decrypted_text)
    pay_resp = decrypted_text.split('|')
    txn_id = pay_resp[0]
    atr_no = pay_resp[1]
    txn_status = pay_resp[2]
    txn_amount = pay_resp[3]
    bank_ref = pay_resp[9]
    txn_date = pay_resp[10]
    challan_no = pay_resp[12]
    total_fee,gst = pay_resp[14].split('^')
    try:
        dv = double_verification(txn_id,merchIdVal,txn_amount)
        dv_status = dv.split('|')[2]
    except Exception as e:
        print("Double Verification not successful!!")
        
    try:
        txn_ref = db.collection('Transaction').document(txn_id)
        txn_ref.update({
            'bank_ref': bank_ref,
            'txn_date': txn_date,
            'challan_no': challan_no,
            'total_fee': total_fee,
            'gst': gst,
            'txn_amount':txn_amount,
            'transaction_status':dv_status,
            'atrn':atr_no
        })
    except Exception as e:
        print("Data not saved")
        
    return redirect(f"https://alcheringa.iitg.ac.in/result?txn_id={txn_id}")

        
        

@csrf_exempt 
@api_view(['GET'])
def download_all_cards(request):
    try:
        txn_id = request.GET.get('txn_id')
        # txn_id = "OuOYnVajoh"  # Replace with actual transaction ID logic
        txn_details = fetch_txn(txn_id)

        if not txn_details:
            return HttpResponse("Transaction not found", status=404)

        attendees = txn_details.get('attendees', [])
        if not attendees:
            return HttpResponse("No attendees found", status=404)

        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for attendee in attendees:
                user_id = attendee.get('user_id')
                pass_type = attendee.get('pass_type')

                if pass_type == "Normal":
                    _, pdf_url = process_normal_card(user_id)
                elif pass_type == "Early":
                    _, pdf_url = process_early_card(user_id)
                else:
                    continue

                if pdf_url:
                    pdf_path = pdf_url.replace(f'https://{settings.MINIO_STORAGE_ENDPOINT}/{settings.MINIO_STORAGE_MEDIA_BUCKET_NAME}/', '')
                    with default_storage.open(pdf_path, 'rb') as pdf_file:
                        zip_file.writestr(f"{user_id}_{pass_type}.pdf", pdf_file.read())

        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename=alcheringa_cards.zip'
        return response

    except Exception as e:
        print(f"Error generating ZIP file: {str(e)}")
        return HttpResponse("Failed to generate ZIP file", status=500)


@api_view(['GET'])
def fetch_verified_users_by_email(request):
    email = request.GET.get('email')

    if not email:
        return JsonResponse({'error': 'Email parameter is required'}, status=400)

    try:
        verified_users_ref = db.collection('verified_users')
        query = verified_users_ref.where('email', '==', email).stream()

        users = []
        for doc in query:
            user_data = doc.to_dict()
            user_data['id'] = doc.id 
            # users.append(user_data)

            user_data_str = json.dumps(user_data)  # Convert user data to a JSON string
            encrypted_data = encrypt('K', user_data_str)
            decrypted_data = decrypt('K', encrypted_data)
            jsonobject = json.loads(decrypted_data)
            users.append(jsonobject)

        if not users:
            return JsonResponse({'message': 'No users found with the given email'}, status=404)

        return JsonResponse({'users': users}, status=200)

    except Exception as e:
        return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)


        
@csrf_exempt
@api_view(['GET'])
def email(request):
    # print (request)
    if request.method == 'GET':
        try:
            email = EmailMessage(
                'Team Registration Confirmation',
                f'Your passes are confirmed.',
                settings.DEFAULT_FROM_EMAIL,
                [request.GET.get('email')],
            )
            email.send()
            return JsonResponse("Email Sent", safe=False, status=200)
        except Exception as e:
            return HttpResponse(f"Error sending email: {str(e)}", status=500)

import requests        
def double_verification(merchant_order_no="",merchant_id = "1003121",amount = None): 
    # url = "https://test.sbiepay.sbi/payagg/statusQuery/getStatusQuery"
    url = "https://www.sbiepay.sbi/payagg/statusQuery/getStatusQuery"
    query_request = f"|{merchant_id}| {merchant_order_no}| {amount}"
    query_request_params = {
        'queryRequest': query_request,
        "aggregatorId": "SBIEPAY",
        "merchantId": merchant_id
    }
    # print(f"{url},{query_request_params}")  # Uncomment for debugging
    response = requests.post(url, data=query_request_params, timeout=60)
    if response.status_code == 200:
        return(response.text)
    else:
        return(f"Error: {response.status_code} - {response.reason}")
        
@api_view(['GET'])
def get_invoice_data(request, transaction_id):
    try:
        transaction_ref = db.collection('Transaction').document(transaction_id)
        transaction_doc = transaction_ref.get()
        if not transaction_doc.exists:
            return Response(
                {'message': 'Transaction not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        transaction_data = transaction_doc.to_dict()
        invoice_data = {
            'invoice_details': {
                'transaction_id': transaction_data['transaction_id'],
                'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'status': transaction_data['transaction_status'],
                'payment_mode': transaction_data['payment_mode'],
                'total_amount': float(transaction_data['transaction_amount'])
            },
            'attendees': []
        }
        for attendee in transaction_data['attendees']:
            attendee_info = {
                'name': attendee['name'],
                'email': attendee['email'],
                'pass_type': attendee['pass_type'],
                'user_id': attendee['user_id'],
                'contact': attendee['contact'],
                'gender': attendee['gender'],
                'age': attendee['age'],
                'id_type': attendee['id_type'],
                'id_number': attendee['id_number']
            }
            invoice_data['attendees'].append(attendee_info)
        invoice_data['summary'] = {
            'total_attendees': len(invoice_data['attendees']),
            'normal_passes': sum(1 for a in invoice_data['attendees'] if a['pass_type'] == 'Normal'),
            'early_passes': sum(1 for a in invoice_data['attendees'] if a['pass_type'] == 'Early')
        }
        print(transaction_data)
        return Response(invoice_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'message': f'Error retrieving invoice data: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def generate_invoice(request):
    try:
        transaction_data = request.session.get('transaction_data')
        print(f"Transaction Data: {transaction_data}")  # Debugging line
        if not transaction_data:
            return Response(
                {'message': 'No transaction data found in session'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        invoice_data = {
            'invoice_details': {
                'transaction_id': transaction_data['transaction_id'],
                'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'status': transaction_data['transaction_status'],
                'payment_mode': transaction_data['transaction_mode'],
                'total_amount': float(transaction_data['transaction_amount'])
            },
            'attendees': transaction_data['attendees'],
            'summary': {
                'total_attendees': len(transaction_data['attendees']),
                'normal_passes': sum(1 for a in transaction_data['attendees'] if a['pass_type'] == 'Normal'),
                'early_passes': sum(1 for a in transaction_data['attendees'] if a['pass_type'] == 'Early')
            }
        }   
        return Response(invoice_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response(
            {'message': f'Error generating invoice data: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

OTP_COLLECTION = "otp_verifications"

def is_otp_expired(otp_created_at):
    if otp_created_at:
        time_difference = timezone.now() - otp_created_at
        if time_difference > timedelta(minutes=5):
            return True
    return False

@csrf_exempt
@api_view(['POST'])
def generate_otp(request):
    if request.method == 'POST':
        email = request.data.get('email')

        # Validate email
        try:
            validate_email(email)
        except ValidationError:
            print("error here")
            return Response({'error': 'Invalid email address.'}, status=status.HTTP_400_BAD_REQUEST)
        

        # Check if an OTP already exists and is not expired

        # Generate OTP
        otp = random.randint(100000, 999999)

        # Save OTP in the database (Firestore)
        otp_data = {
            'email': email,
            'otp': str(otp),  # Convert to string for consistent comparison
            'otp_created_at': timezone.now(),
            'is_verified': False,
        }

        try:
            db.collection(OTP_COLLECTION).document(email).set(otp_data)
        except Exception as e:
            print("error here3")
            
            return Response({'error': f"Error saving OTP to database: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Send OTP via email
        try:
            send_mail(
                subject="Verification Code for Card Registeration",
                message=f"""
Your OTP to verify your email is {otp}.
It is valid for 5 minute.

Regards,
Team Alcheringa""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
            print("mail sent successfully")
            return Response({
                'message': 'OTP has been sent to your email.',
                'email': email
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print("error here4")
            
            return Response({'error': f"Error sending email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def verify_otp(request):
    # print("hello")
    try:
        email = request.data.get('email')
        submitted_otp = request.data.get('otp')

        # Validate input parameters
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not submitted_otp or not submitted_otp.isdigit() or len(submitted_otp) != 6:
            return Response({'error': 'Invalid OTP. Please enter a 6-digit OTP.'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Get OTP document
        try:
            otp_doc = db.collection(OTP_COLLECTION).document(email).get()
        except Exception as e:
            return Response({
                'error': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not otp_doc.exists:
            return Response({
                'error': 'No OTP request found for this email.'
            }, status=status.HTTP_404_NOT_FOUND)

        otp_data = otp_doc.to_dict()
        stored_otp = otp_data.get('otp')
        otp_created_at = otp_data.get('otp_created_at')
        is_verified = otp_data.get('is_verified', False)

        # Check if already verified
        if is_verified:
            return Response({
                'error': 'Email is already verified.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP exists
        if not stored_otp:
            return Response({
                'error': 'No active OTP found. Please request a new one.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP is expired
        if is_otp_expired(otp_created_at):
            return Response({
                'error': 'OTP has expired. Please request a new one.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Verify OTP
        if str(stored_otp) == str(submitted_otp):  # Convert both to strings for comparison
            try:
                # Update document to mark as verified
                db.collection(OTP_COLLECTION).document(email).update({
                    'otp': None,
                    'otp_created_at': None,
                    'is_verified': True,
                    'verified_at': timezone.now()
                })
                return Response({
                    'message': 'OTP verified successfully!'
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    'error': f'Error updating verification status: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # If OTP doesn't match
        return Response({
            'error': 'Invalid OTP. Please try again.'
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'error': f'An unexpected error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def is_otp_expired(otp_created_at):
    if not otp_created_at:
        return True
    
    try:
        expiry_time = 300  
        time_elapsed = (timezone.now() - otp_created_at).total_seconds()
        return time_elapsed > expiry_time
    except Exception:
        return True
    
@csrf_exempt
@api_view(['POST'])
def generate_otp_email(request):
    if request.method == 'POST':
        email = request.data.get('email')
        user_id = request.data.get('userId')

        print("User", user_id)

        # Validate email
        try:
            validate_email(email)
        except ValidationError:
            print("error here")
            return Response({'error': 'Invalid email address.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_doc = db.collection('verified_users').document(user_id).get()
        if not user_doc.exists:
            return Response({'error': 'User ID not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        user_data = user_doc.to_dict()
        if user_data.get('email') != email:
            return Response({'error': 'The provided email is not associated with the given user ID.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if an OTP already exists and is not expired
        otp_doc = db.collection(OTP_COLLECTION).document(email).get()
        if otp_doc.exists:
            otp_data = otp_doc.to_dict()
            otp_created_at = otp_data.get('otp_created_at')
            # Only check rate limit if this is a generate OTP request
            if otp_created_at and not is_otp_expired(otp_created_at):
                time_left = max(0, 300 - (timezone.now() - otp_created_at).seconds)
                print("error here2")
                return Response({
                    'message': f"Please wait for {time_left} seconds before requesting another OTP."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Generate OTP
        otp = random.randint(100000, 999999)

        # Save OTP in the database (Firestore)
        otp_data = {
            'email': email,
            'otp': str(otp),  # Convert to string for consistent comparison
            'otp_created_at': timezone.now(),
            'is_verified': False,
        }

        try:
            db.collection(OTP_COLLECTION).document(email).set(otp_data)
        except Exception as e:
            print("error here3")
            
            return Response({'error': f"Error saving OTP to database: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Send OTP via email
        try:
            send_mail(
                subject="Verification Code for Card Registeration",
                message=f"""
Your OTP to verify your email is {otp}.
It is valid for 5 minute.

Regards,
Team Alcheringa""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
            print("mail sent successfully")
            return Response({
                'message': 'OTP has been sent to your email.',
                'email': email
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print("error here4")
            
            return Response({'error': f"Error sending email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def verify_otp_email(request):
    # print("hello")
    if request.method == 'POST':
        email = request.data.get('email')
        submitted_otp = request.data.get('otp')
        # user_id = request.data.get('userId')

        # print("hello")
        # print(user_id)

        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not submitted_otp or not submitted_otp.isdigit() or len(submitted_otp) != 6:
            return Response({'error': 'Invalid OTP. Please enter a 6-digit OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get OTP document
        otp_doc = db.collection(OTP_COLLECTION).document(email).get()
        
        if not otp_doc.exists:
            return Response({'error': 'No OTP request found for this email.'}, status=status.HTTP_404_NOT_FOUND)

        otp_data = otp_doc.to_dict()
        stored_otp = otp_data.get('otp')
        otp_created_at = otp_data.get('otp_created_at')

        # Check if OTP exists
        if not stored_otp:
            return Response({'error': 'No active OTP found. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if OTP is expired
        if is_otp_expired(otp_created_at):
            return Response({'error': 'OTP has expired. Please request a new one.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify OTP
        if stored_otp == submitted_otp:
            # Update document to mark as verified
            db.collection(OTP_COLLECTION).document(email).update({
                'otp': None,
                'otp_created_at': None,
                'is_verified': True
            })
            return Response({'message': 'OTP verified successfully!'}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid OTP. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)



@csrf_exempt
@api_view(['GET'])
def download_cards_email(request, user_id):
    """
    Generate and return the card download URL and PDF URL for the given user_id.
    """
    try:
        # Get the user_id from the query parameters
        # if not user_id:
        #     return JsonResponse({'error': 'User ID is required.'}, status=400)

        print(f"Generating card for user ID: {user_id}")

        # Fetch the user details from Firestore using the user_id
        user_ref = db.collection('verified_users').document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            print(f"User not found for ID: {user_id}")
            return JsonResponse({'error': 'User not found'}, status=404)

        user_details = user_doc.to_dict()
        pass_type = user_details.get('pass_type', 'Normal')  # Default to 'Normal' if not specified
        primary_email = user_details.get('email','hi@gmail.com')
        processed_cards = []
        pdf_files = []
        # Generate the card based on the pass type
        if pass_type == "Normal" or pass_type == "Normal Season Card":
            download_url, pdf_url = process_normal_card(user_id)
        elif pass_type == "Early":
            download_url, pdf_url = process_early_card(user_id)
        else:
            print(f"Invalid pass type '{pass_type}' for user ID: {user_id}")
            return JsonResponse({'error': 'Invalid pass type.'}, status=400)

        if not download_url or not pdf_url:
            print(f"Failed to generate card for user ID: {user_id}")
            return JsonResponse({'error': 'Failed to generate card.'}, status=500)
        
        if download_url and pdf_url:
                    processed_cards.append({
                        'user_id': user_id,
                        'pass_type': pass_type,
                        'download_url': download_url,
                        'pdf_url': pdf_url
                    })


        # pdf_path = os.path.join(settings.MEDIA_ROOT, pdf_url.replace(settings.MEDIA_URL, ""))
        #         # print(pdf_path)
        # pdf_files.append(pdf_path)

        # Return the URLs in the response
        return JsonResponse({
            'processed_cards': processed_cards, 'email': primary_email }, status=200)

    except Exception as e:
        print(f"Error in download_card: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': 'Internal server error', 'details': str(e)}, status=500)
@api_view(['GET'])
def redirect_to_verify_email(request):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'User ID is required.'}, status=400)

    return redirect(f'https://alcheringa.iitg.ac.in/verify_email?user_id={user_id}')

@api_view(['GET'])
def fetch_verified_users_by_email(request):
    email = request.GET.get('email')

    if not email:
        return JsonResponse({'error': 'Email parameter is required'}, status=400)

    try:
        verified_users_ref = db.collection('verified_users')
        query = verified_users_ref.where('email', '==', email).stream()

        users = []
        for doc in query:
            user_data = doc.to_dict()
            user_data['id'] = doc.id 
            # users.append(user_data)

            user_data_str = json.dumps(user_data)  # Convert user data to a JSON string
            encrypted_data = enc('H@il@lhcer25', user_data_str)
            # decrypted_data = dec('K', encrypted_data)
            # jsonobject = json.loads(encrypted_data)
            users.append({"encrypted_message":encrypted_data})

        if not users:
            return JsonResponse({'message': 'No users found with the given email'}, status=404)

        return JsonResponse({'users': users}, status=200)

    except Exception as e:
        return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)

@api_view(['GET'])
def verifyid(request):
    try:
        id = request.query_params.get('id', None)
        if not id:
            return Response({'error': 'id is required'}, status=status.HTTP_400_BAD_REQUEST)
        user_ref = db.collection('verified_users').document(id).get()
        if user_ref.exists:
            user_dic=user_ref.to_dict()
            email=user_dic['email']
            name = user_dic['name']
            subject = 'Confirmation for Alcheringa 2025 Card!'
            message = f"""
Dear {name},

Thank you for securing your Alcheringa 2025 Card. We're thrilled to welcome you to IIT Guwahati for three days of incredible music, dance, competitions, and fun.

Card Datails:
Name : {name}
ID : {id}

Event Details:
Dates: 31st January to 2nd February
Entry Commences: 31st January, 8am
Fest Conclusion: 2nd February, 11pm

Important guidelines:
1. This card entitles Entry for One Person only.
2. Each card has a unique QR code that will be scanned at the gate during entry. Please bring a valid photo ID proof with you for entry.
3. This Card grants you one-time entry and one-time exit for the chosen day during the fest.
4. Entry Gates will be closed at 5:00pm.
5. Cards are non-transferable. Each card is valid only for the individual named on the card at the time of purchase.
6. Substance abuse of any kind is strictly prohibited.
7. Vehicles are not allowed inside the campus.
8. Non-campus residents must exit the campus by 11:00 p.m.

Have an unforgettable Alcheringa experience! See you there! ✨

You can get your E-Card using https://cardsapi.alcheringa.in/verify?user_id={id}

For more information about the event schedule and other details, please visit our official website: https://www.alcheringa.in
Instagram: https://www.instagram.com/alcheringaiitg

Regards,
Team Alcheringa
            """
            from_email = settings.EMAIL_HOST_USER
            send_mail(subject, message, from_email, [email])
        else:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success':"user verified and email sent successfully"})
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_data(request):
    try:
        verified_users_ref = db.collection('verified_users')
        query = verified_users_ref.stream()

        users = []
        for doc in query:
            user_data = doc.to_dict()
            user_data['id'] = doc.id
            users.append(user_data)

        if not users:
            return JsonResponse({'message': 'No verified users found'}, status=404)

        return JsonResponse({'users': users}, status=200)

    except Exception as e:
        return JsonResponse({'error': 'An error occurred', 'details': str(e)}, status=500)