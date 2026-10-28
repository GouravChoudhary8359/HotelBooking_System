import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HousekeepingTask } from '../../types/hotel';
import {
  Sparkles,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Plus,
  RefreshCw,
} from 'lucide-react';

const STAGES: { key: HousekeepingTask['stage']; label: string; bg: string; border: string }[] = [
  { key: 'Dirty', label: '1. Departure / Dirty', bg: 'bg-rose-50/60', border: 'border-rose-200' },
  { key: 'In Progress', label: '2. Cleaning In Progress', bg: 'bg-amber-50/60', border: 'border-amber-200' },
  { key: 'Cleaned', label: '3. Cleaned (Awaiting Inspection)', bg: 'bg-blue-50/60', border: 'border-blue-200' },
  { key: 'Inspected', label: '4. Inspected & Guest Ready', bg: 'bg-emerald-50/60', border: 'border-emerald-200' },
];

const STAFF_MEMBERS = ['Maria Rodriguez', 'David Kim', 'Priya Patel', 'Carlos Gomez', 'Unassigned'];

export const HousekeepingKanbanView: React.FC = () => {
  const { housekeeping, updateHousekeepingTask } = useHotel();

  const handleNextStage = (task: HousekeepingTask) => {
    if (task.stage === 'Dirty') updateHousekeepingTask(task.id, 'In Progress');
    else if (task.stage === 'In Progress') updateHousekeepingTask(task.id, 'Cleaned');
    else if (task.stage === 'Cleaned') updateHousekeepingTask(task.id, 'Inspected');
  };

  const handleStaffChange = (taskId: string, currentStage: HousekeepingTask['stage'], newStaff: string) => {
    updateHousekeepingTask(taskId, currentStage, newStaff);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-700" />
            <span>Housekeeping & Room Turnaround Workflow</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time operations board for tracking linen replenishment, sanitization, room inspection, and staff assignments.
          </p>
        </div>
      </div>

      {/* 4 Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((col) => {
          const tasksInCol = housekeeping.filter((t) => t.stage === col.key);

          return (
            <div
              key={col.key}
              className={`rounded-2xl border ${col.border} ${col.bg} p-4 flex flex-col min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3">
                <span className="font-bold text-xs text-slate-800">{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-white text-slate-700 text-xs font-bold flex items-center justify-center shadow-xs">
                  {tasksInCol.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {tasksInCol.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-slate-400 text-xs italic">
                    No rooms in this stage
                  </div>
                ) : (
                  tasksInCol.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5"
                    >
                      {/* Room and Priority */}
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900">
                          Room {task.roomNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            task.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : task.priority === 'High'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium">
                        {task.roomType}
                      </div>

                      {/* Notes */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-snug">
                        {task.notes}
                      </p>

                      {/* Assigned Staff Selection */}
                      <div className="text-[11px]">
                        <span className="text-slate-400 block mb-0.5">Assigned Housekeeper:</span>
                        <select
                          value={task.assignedStaff}
                          onChange={(e) =>
                            handleStaffChange(task.id, task.stage, e.target.value)
                          }
                          className="w-full text-xs font-medium border border-slate-200 rounded-md p-1 bg-white focus:outline-none"
                        >
                          {STAFF_MEMBERS.map((staff) => (
                            <option key={staff} value={staff}>
                              {staff}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time and Action */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400">{task.updatedAt}</span>

                        {col.key !== 'Inspected' && (
                          <button
                            onClick={() => handleNextStage(task)}
                            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md flex items-center gap-1 text-[11px] shadow-xs cursor-pointer"
                          >
                            <span>
                              {col.key === 'Dirty'
                                ? 'Start Clean'
                                : col.key === 'In Progress'
                                ? 'Mark Cleaned'
                                : 'Inspect & Pass'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {col.key === 'Inspected' && (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Guest
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
