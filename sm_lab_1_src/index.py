import tkinter as tk

from PIL import Image, ImageEnhance, ImageTk


def update_contrast(value):
    global img, img_tk

    enhancer = ImageEnhance.Contrast(img)
    enhanced_img = enhancer.enhance(float(value))

    img_tk = ImageTk.PhotoImage(enhanced_img)
    image_label.configure(image=img_tk)


def update_cyan(value):
    global img, img_tk

    enhancer = ImageEnhance.Color(img)
    enhanced_img = enhancer.enhance((float(value)/100))

    img_tk = ImageTk.PhotoImage(enhanced_img)
    image_label.configure(image=img_tk)


def update_magenta(value):
    global img, img_tk

    enhancer = ImageEnhance.Color(img)
    enhanced_img = enhancer.enhance((float(value)/100))

    img_tk = ImageTk.PhotoImage(enhanced_img)
    image_label.configure(image=img_tk)


def update_yellow(value):
    global img, img_tk

    enhancer = ImageEnhance.Color(img)
    enhanced_img = enhancer.enhance((float(value)/100))

    img_tk = ImageTk.PhotoImage(enhanced_img)
    image_label.configure(image=img_tk)

# def update_picture(contrast,c,m,y):
#     global img, img_tk

#     contrast_enhancer = ImageEnhance.Contrast(img)
#     c_enhancer = ImageEnhance.Color(img)
#     m_enhancer = ImageEnhance.Color(img)
#     y_enhancer = ImageEnhance.Color(img)

#     enhanced_img = enhancer.enhance(contrast_enhancer.enhance(contrast))

#     img_tk = ImageTk.PhotoImage(enhanced_img)
#     image_label.configure(image=img_tk)


root = tk.Tk()
root.title("Image Enhancer")

# Load and display the original image
img = Image.open("image.jpg")
img_tk = ImageTk.PhotoImage(img)
image_label = tk.Label(root, image=img_tk)
image_label.pack()

# Contrast slider
contrast_label = tk.Label(root, text="Контрастность")
contrast_label.pack()

contrast_scale = tk.Scale(root, from_=0, to=2.0, resolution=0.1,
                          orient=tk.HORIZONTAL, command=update_contrast)
contrast_scale.set(1.0)
contrast_scale.pack()

# Cyan slider
cyan_label = tk.Label(root, text="C")
cyan_label.pack()

cyan_scale = tk.Scale(root, from_=0, to=200,
                      orient=tk.HORIZONTAL, command=update_cyan)
cyan_scale.set(100)
cyan_scale.pack()

# Magenta slider
magenta_label = tk.Label(root, text="M")
magenta_label.pack()

magenta_scale = tk.Scale(root, from_=0, to=200,
                         orient=tk.HORIZONTAL, command=update_magenta)
magenta_scale.set(100)
magenta_scale.pack()

# Yellow slider
yellow_label = tk.Label(root, text="Y")
yellow_label.pack()

yellow_scale = tk.Scale(root, from_=0, to=200,
                        orient=tk.HORIZONTAL, command=update_yellow)
yellow_scale.set(100)
yellow_scale.pack()

root.mainloop()
