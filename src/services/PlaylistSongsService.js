const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(songId, playlistId) {
    const id = `pl-sg-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, songId, playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Song gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylistSongsById(id) {
    const query = {
      text: `SELECT p.id, p.name, u.username, s.id AS song_id, s.title, s.performer FROM playlists p
      JOIN playlist_songs ps ON p.id = ps.playlist_id
      JOIN users u ON p.owner = u.id
      JOIN songs s ON ps.song_id = s.id
      WHERE p.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    const flatRows = result.rows;
    const rows = flatRows.reduce((acc, row) => {
      if (!acc) {
        // eslint-disable-next-line no-param-reassign
        acc = {
          id: row.id,
          name: row.name,
          username: row.username,
          songs: [],
        };
      }

      acc.songs.push({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      });

      return acc;
    }, null);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist Song tidak ditemukan');
    }
    return rows;
  }

  async deletePlaylistSong(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist Song gagal dihapus');
    }
  }
}

module.exports = PlaylistSongsService;
