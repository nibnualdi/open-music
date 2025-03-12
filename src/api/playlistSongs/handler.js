class PlaylistSongsHandler {
  constructor(playlistSongsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    await this._songsService.getSongById(songId);

    const playlistSongId = await this._playlistSongsService.addPlaylistSong(songId, id);

    const response = h.response({
      status: 'success',
      message: 'Playlist Song berhasil ditambahkan',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;

    await this._playlistSongsService.deletePlaylistSong(songId, id);

    return {
      status: 'success',
      message: 'Playlist Song berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongsHandler;
