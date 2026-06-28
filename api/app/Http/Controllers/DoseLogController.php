<?php

namespace App\Http\Controllers;

use App\Models\DoseLog;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoseLogController extends Controller
{
    public function today(Request $request, Profile $profile): JsonResponse
    {
        abort_if($profile->user_id !== $request->user()->id, 403);

        $logs = $profile->doseLogs()
            ->with(['medication', 'doseSchedule'])
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        return response()->json($logs);
    }

    public function history(Request $request, Profile $profile): JsonResponse
    {
        abort_if($profile->user_id !== $request->user()->id, 403);

        $days = $request->user()->isPro() ? 3650 : 30;

        $logs = $profile->doseLogs()
            ->with(['medication', 'doseSchedule'])
            ->where('scheduled_at', '>=', now()->subDays($days))
            ->orderBy('scheduled_at', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'dose_schedule_id' => 'required|exists:dose_schedules,id',
            'medication_id' => 'required|exists:medications,id',
            'profile_id' => 'required|exists:profiles,id',
            'scheduled_at' => 'required|date',
            'taken_at' => 'nullable|date',
            'status' => 'required|in:taken,skipped,missed',
            'notes' => 'nullable|string|max:500',
        ]);

        $profile = Profile::findOrFail($data['profile_id']);
        abort_if($profile->user_id !== $request->user()->id, 403);

        $log = DoseLog::updateOrCreate(
            [
                'dose_schedule_id' => $data['dose_schedule_id'],
                'scheduled_at' => $data['scheduled_at'],
            ],
            $data
        );

        return response()->json($log->load(['medication', 'doseSchedule']), 201);
    }
}
