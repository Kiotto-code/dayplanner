import Array "mo:core/Array";
import Int "mo:core/Int";
import List "mo:core/List";
import Types "../types/timetable";

module {
  public type TimeSlot = Types.TimeSlot;
  public type SlotId = Types.SlotId;
  public type TimeSlotView = Types.TimeSlotView;
  public type CreateSlotArgs = Types.CreateSlotArgs;
  public type UpdateSlotArgs = Types.UpdateSlotArgs;

  public func toView(slot : TimeSlot) : TimeSlotView {
    {
      id = slot.id;
      startTime = slot.startTime;
      endTime = slot.endTime;
      title = slot.title;
      description = slot.description;
      completed = slot.completed;
    };
  };

  public func create(
    slots : List.List<TimeSlot>,
    state : { var nextId : SlotId },
    args : CreateSlotArgs,
  ) : TimeSlotView {
    let id = state.nextId;
    state.nextId += 1;
    let slot : TimeSlot = {
      id;
      var startTime = args.startTime;
      var endTime = args.endTime;
      var title = args.title;
      var description = args.description;
      var completed = false;
    };
    slots.add(slot);
    toView(slot);
  };

  public func getAll(slots : List.List<TimeSlot>) : [TimeSlotView] {
    let views = slots.map<TimeSlot, TimeSlotView>(func(s) { toView(s) });
    let arr = views.toArray();
    arr.sort(func(a, b) { Int.compare(a.startTime, b.startTime) });
  };

  public func update(
    slots : List.List<TimeSlot>,
    args : UpdateSlotArgs,
  ) : ?TimeSlotView {
    switch (slots.find(func(s) { s.id == args.id })) {
      case null null;
      case (?slot) {
        slot.startTime := args.startTime;
        slot.endTime := args.endTime;
        slot.title := args.title;
        slot.description := args.description;
        ?toView(slot);
      };
    };
  };

  public func delete(
    slots : List.List<TimeSlot>,
    id : SlotId,
  ) : Bool {
    let sizeBefore = slots.size();
    let filtered = slots.filter(func(s) { s.id != id });
    if (filtered.size() < sizeBefore) {
      slots.clear();
      slots.append(filtered);
      true;
    } else {
      false;
    };
  };

  public func toggleComplete(
    slots : List.List<TimeSlot>,
    id : SlotId,
  ) : ?TimeSlotView {
    switch (slots.find(func(s) { s.id == id })) {
      case null null;
      case (?slot) {
        slot.completed := not slot.completed;
        ?toView(slot);
      };
    };
  };
};
