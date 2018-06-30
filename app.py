# Dependencies
#------------------------
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine
import pandas as pd

app = Flask(__name__)

#-------------APPLICATION NOTES------------------
#DATABASE DESIGN:
#1. One entry for each year. This entry will contain ranking info for each country, along with data on placement
#in the World Cup (if applicable) 
#2. (optional) One entry (table) that will contain World Cup metadata - this include details of the particular WC,
#like where it was played, teams involved

#Tasks for the app:
#1. route to get the rankings data for whatever year is chosen using the slider
#2. route that will pull metadata on the World Cup for the particular year chosen
#3. Note: the app does not need to pull or reference the geojson file used for drawing borders.
# That can just be linked to in our index.html file

#FUNCTIONALITY
#The app will default to displaying a global choropleth for 2018 showing gloabl rankings
#of all worldwide country teams. Those teams making the world cup will have a special color around their border
#When a country is clicked, the map will zoom in slightly (optional), and details about the country rank
#and (if applicable) performance at that year's World Cup will be shown in a popup. There will be a slider
#associated with the map with all WC years from 1994 - 2018. When the uses selects a year, the map will
#repopulate with data from the particular chosen year

#Below this map, there will be a scatter plot plotting initial ranking vs. performance in the tournament for 
#all tournament teams. There will also be a section containing info (metadata) on the World Cup, like
#which country it was played in, who won, (optional) who got the golden boot, silver boot, etc.

#We also may want to include an analysis of all of our World cups that will look at which one had the most
#surprising results
#-----------------END NOTES-------------------

# create an engine to conenct to our database and perform sql queries
#---------------------------------
engine = create_engine('sqlite:///db/world_cup_db', echo=False)
conn = engine.connect()

Base = automap_base()
Base.prepare(engine, reflect=True)
session = Session(engine)

# if statement that sets year = to certain year
year = 1994

df = pd.DataFrame(engine.execute(f"SELECT team, abrv, WC_{year}, FIFA_{year} FROM world_cup_db WHERE WC_{year} > 0").fetchall()) 
df

# reflect the db tables into classes
#-------------------------------
rankings_data = Base.classes.world_cup_db
# cup_data = Base.classes.'NAME FOR DATABASE WITH METADATA FOR EACH WORLD CUP'

# Flask Routes
#-------------------------------
@app.route("/")
def index():
    return render_template("index.html")

#grab the data on each country's rankings from the table for the specified year
@app.route("/db") #STEVEN: LEAVE THE APP ROUTE IN PLACE
def db():
    db_query = session.query(select * from rankings_data)
    rankings = db.query
    return jsonify(rankings) #STEVEN: LEAVE THE RETURN NAME 'RANKINGS' IN PLACE

#grab the world cup metadata for the specified year
# @app.route("/cup_data/<year>")
# def cup_data(year):
#     year_query = session.query(cup_data.STUFF!, metadata.BBTYPE, metadata.ETHNICITY, metadata.GENDER, metadata.LOCATION, metadata.SAMPLEID).\
#         filter(cup_data.year).one()
#     year_dict = {
#         # 'AGE': meta_one[0], 
#         # 'BBTYPE': meta_one[1], 
#         # 'ETHNICITY': meta_one[2], 
#         # 'GENDER': meta_one[3], 
#         # 'LOCATION': meta_one[4], 
#         # 'SAMPLEID': meta_one[5]
#         # }
#     return jsonify(year_dict)

if __name__ == "__main__":
    app.run(debug=True)