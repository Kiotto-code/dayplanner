import Time "mo:core/Time";

module {
  public type SlotId = Nat;

  public type TimeSlot = {
    id : SlotId;
    var startTime : Int;
    var endTime : Int;
    var title : Text;
    var description : Text;
    var completed : Bool;
  };

  /// Shared (serializable) view of a TimeSlot for the public API
  public type TimeSlotView = {
    id : SlotId;
    startTime : Int;
    endTime : Int;
    title : Text;
    description : Text;
    completed : Bool;
  };

  public type CreateSlotArgs = {
    startTime : Int;
    endTime : Int;
    title : Text;
    description : Text;
  };

  public type UpdateSlotArgs = {
    id : SlotId;
    startTime : Int;
    endTime : Int;
    title : Text;
    description : Text;
  };
};
