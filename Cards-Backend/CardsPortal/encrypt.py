import hashlib

from Crypto.Cipher import AES
import base64
import os


# AES 'pad' byte array to multiple of BLOCK_SIZE bytes
def pad(byte_array):
    BLOCK_SIZE = 16

    pad_len = BLOCK_SIZE - len(byte_array) % BLOCK_SIZE
    return byte_array + (bytes([pad_len]) * pad_len)


# Remove padding at end of byte array
def unpad(byte_array):
    last_byte = byte_array[-1]
    return byte_array[0:-last_byte]


def encrypt(key, message, shaType):
    checksum256 = "SHA256"
    checksum512 = "SHA512"

    if checksum256 == shaType:
        result = hashlib.sha256(message.encode())
    elif checksum512 == shaType:
        result = hashlib.sha512(message.encode())
    else:
        result = hashlib.sha256(message.encode())

    concatePipe = message
    byte_array = concatePipe.encode("UTF-8")
    padded = pad(byte_array)
    iv = os.urandom(AES.block_size)

    cipher = AES.new(key.encode("UTF-8"), AES.MODE_CBC, iv)

    encrypted = cipher.encrypt(padded)
    # Note we PREPEND the unencrypted iv to the encrypted message
    return base64.b64encode(iv + encrypted).decode("UTF-8")


def decrypt(key, message):
    byte_array = base64.b64decode(message)
    iv = byte_array[0:16]  # extract the 16-byte initialization vector
    messagebytes = byte_array[16:]  # encrypted message is the bit after the iv

    cipher = AES.new(key.encode("UTF-8"), AES.MODE_CBC, iv)

    decrypted_padded = cipher.decrypt(messagebytes)

    decrypted = unpad(decrypted_padded)

    return decrypted.decode("UTF-8")


plainText = "1000602|DOM|IN|INR|500|http://localhost:8000/payResp/|http://localhost:8000/payResp/|SBIEPAY|000030|000030|NB|ONLINE|ONLINE"




encrptionKey = "/AwM23vfOYJvr8WPM2V4tA=="
checksumType = "SHA256"

# encrypt = encrypt(encrptionKey, plainText, checksumType)

# print("======encrypt=====")
# print(encrypt)

# decrypt = decrypt("V5csjV4nMM8pz6uWaSp1Iw==", "3KiHgolnufJ3NRMsswDIfTe6OMn3fRXMk/Y1Xy7tTHpK+FUVeNDeL/tliZqJ63vJcPYFDoM/6u14NyDS05Tldd/e7CGed2cq07I1F0HpFB+fyBBAFr2a4Zs1GLl3r+7e9rKvTGM6UjaT+jcM6cZJUdDOpygV4sAnARt7mP0oCPR+pouvKlHiJ9n9RS7EI1Och7I2yfYTniTlM8XoceDiYoo8sKMa3NxO88G8mOCzaLQ=")
# # decrypt = decrypt(encrptionKey,encrypt)
# print("======decrypt=====")
# print(decrypt)