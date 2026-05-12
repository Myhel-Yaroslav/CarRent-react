<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'FirstName')) {
                $table->string('FirstName')->nullable();
                $table->string('LastName')->nullable();
                $table->string('Phone')->nullable();
                $table->string('PassportNumber')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['FirstName', 'LastName', 'Phone', 'PassportNumber']);
        });
    }
};
