# Dependencies
#------------------------
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine
import pandas as pd
import json

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
#Steven absolute address code"
# engine = create_engine('sqlite:///C:\\Users\\zulim2\\Downloads\\Analytics\\World-Cup-Analysis\\data\\world_cup.db', echo=False)

engine = create_engine('sqlite:///data/world_cup.db', echo=False)

# Base = automap_base()
# Base.prepare(engine, reflect=True)
# session = Session(engine)

# reflect the db tables into classes
#-------------------------------
#rankings_data = Base.classes.world_cup_db
# cup_data = Base.classes.'NAME FOR DATABASE WITH METADATA FOR EACH WORLD CUP'

# Flask Routes
#-------------------------------
@app.route("/")
def index():
    return render_template("index.html")

#temporary route for viewing/testing the scatterplot
@app.route("/scatter/")
def scatter():
    return render_template("scatterplot.html")

#temporary route for viewing/testing slider on metadata
@app.route("/slider/")
def view_slider():
    return render_template("slider_and_metadata.html")


#Full ranking data for scatterplot and map
@app.route("/rankings/")
def ranking():
    rankings_data = engine.execute("SELECT * FROM rankings_table").fetchall()
    rankings_headers = engine.execute("SELECT * FROM rankings_table").keys()

    rankings_zip = []

    for row in rankings_data:
        rankings_zip.append(dict(zip(rankings_headers, row)))
    
    return jsonify(rankings_zip)


#This route is for the WC metadata used to show info about each WC alongside the map
@app.route("/metadata/<year>/")
def metadata(year):
    metadata_data = engine.execute(f"SELECT * FROM metadata_table WHERE Year = {year}").fetchall()
    metadata_headers = engine.execute("SELECT * FROM metadata_table").keys()

    metadata = []

    for row in metadata_data:
        metadata.append(dict(zip(metadata_headers, row)))
    
    return jsonify(metadata)



if __name__ == "__main__":
    app.run(debug=True)