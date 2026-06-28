<?php

namespace App\Http\Controllers;

use App\Models\Medication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function show(Request $request, Medication $medication): JsonResponse
    {
        abort_if($medication->profile->user_id !== $request->user()->id, 403);

        return response()->json($medication->stock()->firstOrCreate([
            'medication_id' => $medication->id,
        ]));
    }

    public function update(Request $request, Medication $medication): JsonResponse
    {
        abort_if($medication->profile->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'current_quantity' => 'required|numeric|min:0',
            'unit' => 'sometimes|string|max:30',
            'min_alert_quantity' => 'sometimes|numeric|min:0',
        ]);

        $stock = $medication->stock()->updateOrCreate(
            ['medication_id' => $medication->id],
            array_merge($data, ['last_updated_at' => now()])
        );

        return response()->json($stock);
    }
}
