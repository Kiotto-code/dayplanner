import List "mo:core/List";

module {
  // Old types — copied from .old/src/backend/types/timetable.mo
  type SlotId = Nat;
  type OldTimeSlot = {
    id : SlotId;
    var startTime : Int;
    var endTime : Int;
    var title : Text;
    var description : Text;
    var completed : Bool;
  };

  // New types — must match new actor state exactly
  type SlotCategory = { #work; #personal; #study };
  type NewTimeSlot = {
    id : SlotId;
    var startTime : Int;
    var endTime : Int;
    var title : Text;
    var description : Text;
    var completed : Bool;
    var category : SlotCategory;
  };

  type OldActor = {
    slots : List.List<OldTimeSlot>;
    state : { var nextId : SlotId };
  };

  type NewActor = {
    slots : List.List<NewTimeSlot>;
    state : { var nextId : SlotId };
  };

  public func run(old : OldActor) : NewActor {
    let slots = old.slots.map<OldTimeSlot, NewTimeSlot>(
      func(s : OldTimeSlot) : NewTimeSlot {
        {
          id = s.id;
          var startTime = s.startTime;
          var endTime = s.endTime;
          var title = s.title;
          var description = s.description;
          var completed = s.completed;
          var category = #personal : SlotCategory;
        };
      }
    );
    { slots; state = old.state };
  };
};
