class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id } = request.params;

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistCollabOwner(id, credentialId);

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

  async getPlaylistSongsHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    const playlist = await this._playlistSongsService.getPlaylistSongsById(id);
    await this._playlistsService.verifyPlaylistCollabOwner(id, credentialId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistCollabOwner(id, credentialId);
    await this._playlistSongsService.deletePlaylistSong(songId, id);

    return {
      status: 'success',
      message: 'Playlist Song berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongsHandler;
