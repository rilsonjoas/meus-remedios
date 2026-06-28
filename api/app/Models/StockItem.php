<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockItem extends Model
{
    protected $fillable = [
        'medication_id',
        'current_quantity',
        'unit',
        'min_alert_quantity',
        'last_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'current_quantity' => 'float',
            'min_alert_quantity' => 'float',
            'last_updated_at' => 'datetime',
        ];
    }

    public function medication(): BelongsTo
    {
        return $this->belongsTo(Medication::class);
    }

    public function isLow(): bool
    {
        return $this->current_quantity <= $this->min_alert_quantity;
    }
}
