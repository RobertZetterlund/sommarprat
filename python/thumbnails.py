from PIL import Image
import json
import urllib.request
import os


years = range(2005, 2022, 1)

# create thumbnail folder
os.mkdir("thumbnails")

for year in years:
    f = open("../playlist_creation/data/" + str(year) + ".json")
    data = json.load(f)
    f.close()

    files = []
    # Take 16 images for 4x4 grid
    for i in data[:16]:
        filename = i.get('date') + ".jpg"
        files.append(str(year) + "/" + filename)

    new_im = Image.new('RGB', (512, 512))

    index = 0
    for i in range(0, 512, 128):
        for j in range(0, 512, 128):
            im = Image.open(files[index])
            im.thumbnail((128, 128))
            new_im.paste(im, (i, j))
            index += 1

    new_im.save("thumbnails/" + str(year) + ".jpg")
