class PlaylistActivitiesHandler {
  constructor(service, playlistsService) {
    this._service = service;
    this._playlistsService = playlistsService;

    // eslint-disable-next-line max-len
    this.getPlaylistActivityByPlaylistIdHandler = this.getPlaylistActivityByPlaylistIdHandler.bind(this);
  }

  async getPlaylistActivityByPlaylistIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.getPlaylistById(id);
    await this._playlistsService.verifyPlaylistCollabOwner(id, credentialId);
    const activities = await this._service.getPlaylistActivityByPlaylistId(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;
