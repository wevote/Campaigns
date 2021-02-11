export default function voterPhoto (voter) {
  const placeholderImageUrl = '';
  if (!voter) {
    return placeholderImageUrl;
  }
  const {
    voter_photo_url_medium: voterPhotoUrlMedium,
  } = voter;
  return voterPhotoUrlMedium;
}
