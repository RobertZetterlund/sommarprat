from PIL import Image
import json
import urllib.request
import os


years = range(2005, 2023, 1)

# create thumbnail folder
os.mkdir("thumbnails")

for year in years:
    f = open("../playlist_creation/data/" + str(year) + ".json")
    data = json.load(f)
    f.close()

    files = []
    # Take 9 images for 3x3 grid
    for i in data[18:27]:
        filename = i.get('date') + ".jpg"
        files.append(str(year) + "/" + filename)

    new_im = Image.new('RGB', (360, 360))

    index = 0
    for i in range(0, 360, 120):
        for j in range(0, 360, 120):
            file = files[index]
            print(file)
            im = Image.open(files[index])
            im.thumbnail((120, 120))
            new_im.paste(im, (i, j))
            index += 1

    new_im.save("thumbnails/" + str(year) + ".jpg")
