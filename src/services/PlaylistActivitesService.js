const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistActivitesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity({
    playlistId, songId, userId, action,
  }) {
    const id = `pl-act-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Activity gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  // eslint-disable-next-line no-unused-vars
  async getPlaylistActivityByPlaylistId(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activities psa
      JOIN users u ON psa.user_id = u.id
      JOIN songs s ON psa.song_id = s.id
      WHERE playlist_id = $1
      ORDER BY psa.time`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist Activities tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = PlaylistActivitesService;
