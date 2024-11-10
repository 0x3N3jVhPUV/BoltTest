export interface VideoSummary {
  video_id: string;
  title: string;
  channel_name: string;
  video_link: string;
  duration: number;
  publish_date: string;
  has_subtitles: boolean;
  summary: string;
  category: string;
  author: string;
}

export interface Category {
  id: string;
  name: string;
  videos: VideoSummary[];
}