

import spotipy, json
from spotipy.oauth2 import SpotifyClientCredentials


sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="04d3f14eb6174b4085f9bf019e65c09f",
                                                           client_secret="e907e48c86c24a1d878367e40102a0af"))

results = sp.search(q='taylor swift', limit=1, type="artist")

# print(results["artists"]["items"][0])

taylors_uri = 'spotify:artist:06HL4z0CvFAxyc27GXpf02'

albums = sp.artist_albums(taylors_uri, album_type="album", country="CL")

albums = [album for j, album in enumerate(albums["items"]) if j in [0, 2, 4, 10, 14] ]

# print(albums[0].keys())

taylors_songs = []

albums_titles = {"Red (Taylor's Version)": "red", 
               "Fearless (Taylor's Version)": "fearless",
               'evermore (deluxe version)': "evermore", 
               'folklore (deluxe version)': "folklore", 'Lover': "lover"}

for album in albums:

    songs = sp.album_tracks(album["id"])

    songs = [song for j, song in enumerate(songs["items"])]

    features = []

    album_title = albums_titles[album["name"]]

    for song in songs:
        
        song_features = {"id": song["id"], "track_number": song["track_number"],
                       "name": song["name"], "preview_url": song["preview_url"] }

        song_features["album"] = album_title
        
        result = sp.audio_features(song["id"])[0]


        for feature in ["danceability", "energy", "key", "loudness", "mode", "speechiness", 
                 "acousticness", "instrumentalness", "liveness", "valence", "tempo", "duration_ms", "time_signature"]:

            song_features[feature] = result[feature]

        features.append(song_features)


    taylors_songs += features 


json.dump(taylors_songs, open("taylors_songs.json", "w", encoding="utf-8"))
# for idx, track in enumerate(results['tracks']['items']):
#     print(idx, track['name'])