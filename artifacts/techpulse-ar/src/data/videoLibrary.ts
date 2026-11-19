import videosJson from '@/content/videos.json';
import playlistsJson from '@/content/video-playlists.json';
import type { LibraryPlaylist, LibraryVideo } from '@/lib/videoLibrary';

export const libraryVideos = videosJson as unknown as LibraryVideo[];
export const libraryPlaylists = playlistsJson as unknown as LibraryPlaylist[];
