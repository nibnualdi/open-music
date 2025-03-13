const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({
    name,
    credentialId,
  }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id, name, owner',
      values: [id, name, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists() {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists p
      LEFT JOIN users u
      ON p.owner = u.id`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);
    const ids = result.rows.map((e) => e.id);

    if (!ids.includes(playlistId)) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
