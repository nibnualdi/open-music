class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = 'unnamed', year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
