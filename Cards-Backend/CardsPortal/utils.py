import qrcode
from io import BytesIO
import base64
from PIL import Image, ImageOps
from PIL import ImageDraw, ImageFont
import os
from django.conf import settings
from .crypto import encrypt
from django.core.files.storage import default_storage

def generate_qr_code(data):
    try:
        qr = qrcode.QRCode(
            version=1,
            box_size=10,
            border=1,
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        return img
    except Exception as e:
        print(f"Error in generate_qr_code: {str(e)}")
        return None

def combine_image_with_qr(image_path, card_type, user_id):
    try:
        with Image.open(image_path) as base_image:
            base_image = base_image.convert('RGBA')
            
            # Generate QR code
            data = f"https://cardsapi.alcheringa.in/verify?user_id={user_id}"
           
            qr_image = generate_qr_code(data)
            if not qr_image:
                return None

            # Convert QR to RGBA and resize
            qr_image = qr_image.convert('RGBA')
            qr_width = int(base_image.width * 0.4)
            qr_height = qr_width
            qr_image = qr_image.resize((qr_width, qr_height))

            # Position QR code on the image
            x_position = int(base_image.width * 0.07)
            y_position = int(base_image.height * 0.59)

            # Create a new image with the same size as the base
            combined = Image.new('RGBA', base_image.size)
            combined.paste(base_image, (0, 0))
            combined.paste(qr_image, (x_position, y_position), qr_image)


            draw = ImageDraw.Draw(combined)
            text = f"{user_id}"  # Text to add to the image
            font_path = os.path.join(settings.STATICFILES_DIRS[0], 'fonts', 'Game_Tape.ttf')  # Adjust path as needed
            print("Font path:") 
            print(font_path)
            try:
                font = ImageFont.truetype(font_path, size=44)  # Load font
            except IOError:
                print("Error loading font. Falling back to default font.")
                font = ImageFont.load_default()  # Fallback to default font if TTF font not found

            # Text position (adjust as needed)
            text_x = int(base_image.width * 0.6)
            text_y = int(base_image.height * 0.677)

            # Add text with shadow for better visibility
            # shadow_offset = 2
            # shadow_color = "black"
            text_color = "black"

            draw.text((text_x, text_y), text, font=font, fill=text_color)

            text_x = int(base_image.width * 0.62)
            text_y = int(base_image.height * 0.030)

            # Add text with shadow for better visibility
            # shadow_offset = 2
            # shadow_color = "black"
            # text_color = "white"
            print("Adding text")
            draw.text((text_x, text_y), text, font=font, fill=text_color)

            # output_dir = os.path.join(settings.MEDIA_ROOT, 'combined_cards')
            # Save the combined image with a unique name based on card_type
            # os.makedirs(output_dir, exist_ok=True)
            output_path = f'img/card_{user_id}_{card_type}.png'
            image_storage=default_storage
            combined_bytes = BytesIO()
            combined.save(combined_bytes, format='PNG')
            combined_bytes.seek(0)
            image_path = image_storage.save(output_path, combined_bytes)
            # combined.save(output_path, 'PNG')
            
            # Return relative path
            return f'img/card_{user_id}_{card_type}.png'
    except Exception as e:
        print(f"Error in combine_image_with_qr: {str(e)}")
        return None

def get_image_as_base64(image_path):
    try:
        with Image.open(image_path) as img:
            buffered = BytesIO()
            img.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            return f"data:image/png;base64,{img_str}"
    except Exception as e:
        print(f"Error in get_image_as_base64: {str(e)}")
        return None

def convert_image_to_pdf(image_path, output_path):
    try:
        with Image.open(image_path) as img:
            # Ensure the image is in RGB mode for PDF conversion
            img = img.convert('RGB')
            img.save(output_path, "PDF", resolution=100.0)
        return output_path
    except Exception as e:
        print(f"Error converting image to PDF: {str(e)}")
        return None
    
def convert_multiple_images_to_pdf(image_paths, output_path):
        try:
            images = []
            for image_path in image_paths:
                with default_storage.open(image_path) as img_file:
                    with Image.open(img_file) as img:
                        # Convert to RGB mode and append to list
                        img = img.convert('RGB')
                        images.append(img)
            
            # Save all images to PDF
            if images:
                image_storage = default_storage
                pdf_bytes = BytesIO()
                images[0].save(pdf_bytes, "PDF", resolution=100.0, save_all=True, append_images=images[1:])
                pdf_bytes.seek(0)
                image_storage.save(output_path, pdf_bytes)
                return output_path
        except Exception as e:
            print(f"Error converting images to PDF: {str(e)}")
            return None

