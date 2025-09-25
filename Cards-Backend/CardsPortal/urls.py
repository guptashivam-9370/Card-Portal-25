from django.urls import path
from . import views
urlpatterns = [
    path('', views.home_view, name='home'),
    path('register/', views.register, name='register'),
    path('download-all/', views.download_all_cards, name='download_all_cards'),
    # path('error/', views.error_view, name='error'),
    path('result/<str:txn_id>', views.success_view, name='result'),#done
    # path('user/<str:id>',views.user_details,name='user_details'),
    path('payResp/',views.payResponse,name='pay_response'),
    path('email/',views.email,name='users'),
    # path('summary/',views.summary, name='summary'),
    path('get-session-data/', views.get_session_data, name='get_session_data'),
    path('edit/',views.edit_view, name="edit"),
    path('invoice/<str:transaction_id>/', views.get_invoice_data, name='get_invoice'),
    path('api/invoice/generate/', views.generate_invoice, name='generate_invoice'),
    path('api/generate-otp/', views.generate_otp, name='generate_otp'),
    path('api/verify-otp/', views.verify_otp, name='verify_otp'),
    path('api/generate-otp-email/', views.generate_otp_email, name='generate_otp_email'),
    path('api/verify-otp-email/', views.verify_otp_email, name='verify_otp_email'),
    path('verify/', views.redirect_to_verify_email, name='redirect'),
    path('api/fetchuser',views.fetch_verified_users_by_email ,name='filter-users-email'),
    path('api/send_email', views.verifyid, name='verifyid'),
    path('download/<str:user_id>', views.download_cards_email, name='download_cards_email'),#done
    path('api/test',views.upload_png_to_media,name='upload_png_to_media'),
    path('api/getData',views.get_data,name='get_data'),
]
