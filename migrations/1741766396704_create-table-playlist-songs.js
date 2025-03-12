/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      references: '"songs"',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: '"playlists"',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });
  pgm.createIndex('playlist_songs', 'song_id');
  pgm.createIndex('playlist_songs', 'playlist_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropIndex('playlist_songs', 'song_id');
  pgm.dropIndex('playlist_songs', 'playlist_id');
  pgm.dropTable('playlist_songs');
};
