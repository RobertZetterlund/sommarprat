from PIL import Image
import json
import urllib.request
import os


years = range(2005, 2023, 1)

for year in years:
    f = open("../playlist_creation/data/" + str(year) + ".json")
    data = json.load(f)
    f.close()
    # create year folder
    os.mkdir(str(year))

    # download all images and save in folder
    for i in data:
        date = i.get('date')
        imageurl = i.get('imageurl')
        urllib.request.urlretrieve(imageurl, str(year) + "/" + date + ".jpg")
