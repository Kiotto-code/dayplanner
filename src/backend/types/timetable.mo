import Time "mo:core/Time";

module {
  public type SlotId = Nat;
  public type SlotCategory = { #work; #personal; #study };


  public type TimeSlot = {
    id : SlotId;
    var startTime : Int;
    var endTime : Int;
    var title : Text;
    var description : Text;
    var completed : Bool;
    var category : SlotCategory;
  };

  /// Shared (serializable) view of a TimeSlot for the public API
  public type TimeSlotView = {
    id : SlotId;
    startTime : Int;
    endTime : Int;
    title : Text;
    description : Text;
    completed : Bool;
    category : SlotCategory;
  };

  public type CreateSlotArgs = {
    startTime : Int;
    endTime : Int;
    title : Text;
    description : Text;
    category : SlotCategory;
  };

  public type UpdateSlotArgs = {
    id : SlotId;
    startTime : Int;
    endTime : Int;
    title : Text;
    description : Text;
    category : SlotCategory;
  };
};
