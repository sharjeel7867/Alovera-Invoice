from PIL import Image
import os

img_path = r"c:\Users\pc\Desktop\Alover Invoice\assets\images\newlogoAl.png"
ico_path = r"c:\Users\pc\Desktop\Alover Invoice\icon.ico"

img = Image.open(img_path)
img.save(ico_path, format="ICO", sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])
print("Icon created successfully.")
