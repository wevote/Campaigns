
export default function keepHelpingDestination (step2Completed = false, payToPromoteStepCompleted = false, payToPromoteStepTurnedOn = false, sharingStepCompleted = false) {
  if (!step2Completed) {
    return 'why-do-you-support';
  } else if (payToPromoteStepTurnedOn && !payToPromoteStepCompleted) {
    return 'pay-to-promote';
  } else if (!sharingStepCompleted) {
    return 'share-campaign';
  } else {
    return 'share-campaign';
  }
}
