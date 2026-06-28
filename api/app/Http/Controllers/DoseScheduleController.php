<?php

namespace App\Http\Controllers;

use App\Models\DoseSchedule;
use App\Models\Medication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoseScheduleController extends Controller
{
    public function index(Request $request, Medication $medication): JsonResponse
    {
        $this->authorizeMedication($request, $medication);

        return response()->json($medication->schedules()->where('is_active', true)->get());
    }

    public function store(Request $request, Medication $medication): JsonResponse
    {
        $this->authorizeMedication($request, $medication);

        $data = $request->validate([
            'time' => 'required|date_format:H:i',
            'days_of_week' => 'nullable|array',
            'days_of_week.*' => 'integer|between:0,6',
            'interval_hours' => 'nullable|integer|min:1|max:168',
        ]);

        $schedule = $medication->schedules()->create($data);

        return response()->json($schedule, 201);
    }

    public function update(Request $request, DoseSchedule $doseSchedule): JsonResponse
    {
        $this->authorizeSchedule($request, $doseSchedule);

        $data = $request->validate([
            'time' => 'sometimes|date_format:H:i',
            'days_of_week' => 'nullable|array',
            'days_of_week.*' => 'integer|between:0,6',
            'interval_hours' => 'nullable|integer|min:1|max:168',
            'is_active' => 'sometimes|boolean',
        ]);

        $doseSchedule->update($data);

        return response()->json($doseSchedule);
    }

    public function destroy(Request $request, DoseSchedule $doseSchedule): JsonResponse
    {
        $this->authorizeSchedule($request, $doseSchedule);
        $doseSchedule->delete();

        return response()->json(null, 204);
    }

    private function authorizeMedication(Request $request, Medication $medication): void
    {
        abort_if($medication->profile->user_id !== $request->user()->id, 403);
    }

    private function authorizeSchedule(Request $request, DoseSchedule $schedule): void
    {
        abort_if($schedule->medication->profile->user_id !== $request->user()->id, 403);
    }
}
