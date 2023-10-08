import tkinter as tk

from PIL import Image, ImageEnhance, ImageTk


# Обновление общего контраста
def update_contrast(value):
    global cyan_scale, magenta_scale, yellow_scale, img, img_tk

    # Сброс значений контраста по CMYK
    cyan_scale.set(1)
    magenta_scale.set(1)
    yellow_scale.set(1)

    # Изменение общего контраста
    enhancer = ImageEnhance.Contrast(img)
    enhanced_img = enhancer.enhance(float(value))

    # Рендер изображение
    img_tk = ImageTk.PhotoImage(enhanced_img)
    image_label.configure(image=img_tk)

# Изменение значения контраста для цвета Cyan


def update_cyan(value):
    global c, m, y
    c = value
    update_cmyk(c, m, y)

# Изменение значения контраста для цвета Magenta


def update_magenta(value):
    global c, m, y
    m = value
    update_cmyk(c, m, y)

# Изменение значения контраста для цвета Yellow


def update_yellow(value):
    global c, m, y
    y = value
    update_cmyk(c, m, y)

# Изменение контраста по CMYK


def update_cmyk(c, m, y):
    global img, img_tk, contrast_scale

    # Сброс значений общего контраста
    contrast_scale.set(1)

    # Вывод для debug
    print(float(c), float(m), float(y))

    # Разделение изображения по CMYK каналам
    c_img, m_img, y_img, k_img = img.split()

    # Контраст по цветам
    c_enhancer = ImageEnhance.Contrast(c_img)
    m_enhancer = ImageEnhance.Contrast(m_img)
    y_enhancer = ImageEnhance.Contrast(y_img)

    c_enhanced_img = c_enhancer.enhance(float(c))
    m_enhanced_img = m_enhancer.enhance(float(m))
    y_enhanced_img = y_enhancer.enhance(float(y))

    # Слияние измененных каналов
    final_img = Image.merge("CMYK", [c_enhanced_img,
                            m_enhanced_img, y_enhanced_img, k_img])

    # Рендер изображение
    img_tk = ImageTk.PhotoImage(final_img)
    image_label.configure(image=img_tk)

# Сброс всех значений


def reset_scales():
    global contrast_scale, cyan_scale, magenta_scale, yellow_scale
    contrast_scale.set(1)
    cyan_scale.set(1)
    magenta_scale.set(1)
    yellow_scale.set(1)


# Глобальные значения цветов CMYK
c = 1
m = 1
y = 1

# Значения для слайдера
set_from = 0
set_to = 2.0

# Значение по умолчанию
set_default = 1.0

# root окна
root = tk.Tk()

# Название окна
root.title("Contrast")

# Загрузка изображения
img = Image.open("image.jpg").convert('CMYK')
img_tk = ImageTk.PhotoImage(img)

# Конфигурирование элемента изображения
image_label = tk.Label(root, image=img_tk, height=300, width=300)
image_label.grid(row=1, column=1, columnspan=4)

# Слайдер контраста
contrast_label = tk.Label(root, text="Контраст")
contrast_label.grid(row=2, column=1)

contrast_scale = tk.Scale(root, from_=0, to=2.0, resolution=0.1,
                          orient=tk.HORIZONTAL, command=update_contrast)
contrast_scale.set(1.0)
contrast_scale.grid(row=2, column=2)

# Кнопка сброса
reset_button = tk.Button(root, text="Сбросить", command=reset_scales)
reset_button.grid(row=3, column=1)

# Слайдер cyan
cyan_label = tk.Label(root, text="C")
cyan_label.grid(row=2, column=3)

cyan_scale = tk.Scale(root, from_=set_from, to=set_to, resolution=0.1,
                      orient=tk.HORIZONTAL, command=update_cyan)
cyan_scale.set(set_default)
cyan_scale.grid(row=2, column=4)

# Слайдер magenta
magenta_label = tk.Label(root, text="M")
magenta_label.grid(row=3, column=3)

magenta_scale = tk.Scale(root, from_=set_from, to=set_to, resolution=0.1,
                         orient=tk.HORIZONTAL, command=update_magenta)
magenta_scale.set(set_default)
magenta_scale.grid(row=3, column=4)

# Слайдер yellow
yellow_label = tk.Label(root, text="Y")
yellow_label.grid(row=4, column=3)

yellow_scale = tk.Scale(root, from_=set_from, to=set_to, resolution=0.1,
                        orient=tk.HORIZONTAL, command=update_yellow)
yellow_scale.set(set_default)
yellow_scale.grid(row=4, column=4)

# Цикл окна
root.mainloop()
