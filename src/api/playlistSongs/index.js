const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, { playlistSongsService, songsService, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      songsService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
