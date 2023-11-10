using { sap.fe.cap.travel as my } from '../db/schema';

service TravelService @(path:'/processor') {

@(
    Common.SideEffects              : {
        TargetEntities : ['/TravelService.EntityContainer/Travel']
    }
)
@Core.OperationAvailable: false
action testing();

  @(restrict: [
    { grant: 'READ', to: 'authenticated-user'},
    { grant: ['rejectTravel','acceptTravel','deductDiscount'], to: 'reviewer'},
    { grant: ['*'], to: 'processor'},
    { grant: ['*'], to: 'admin'}
  ])
  entity Travel as projection on my.Travel actions {
    action createTravelByTemplate() returns Travel;
    action rejectTravel();
    action acceptTravel();
    action deductDiscount( percent: Percentage not null ) returns Travel;
  };

}

type Percentage : Integer @assert.range: [1,100];

// annotate TravelService.EntityContainer
// actions {
//   testing @(
//     Common.SideEffects              : {
//         TargetEntities : ['/TravelService.EntityContainer/Travel']
//     }
// );
// }