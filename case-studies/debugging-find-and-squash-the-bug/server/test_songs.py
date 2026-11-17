songs = {'Song A': 5, 'Song B': 4}
new_song = {'Song C': 6}
def add_song_to_favorites(songs, new_song):
  for song, rating in new_song.items():
    if song not in songs or rating > songs[song]:
      songs[song] = rating
  return songs
songs = add_song_to_favorites(songs, new_song)
print(songs)
