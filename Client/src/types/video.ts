export interface Video {
  id?: string;
  video_id: string;
  title: string;
  channel_name: string;
  video_link: string;
  duration: number;
  publish_date: string;
  has_subtitles: boolean;
  summary: string;
  category: string;
  createdAt?: Date;
  favorite_themes?: string[];
}