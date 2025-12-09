<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('reportes', function (Blueprint $table) {
            $table->string('codigo', 20)->unique()->nullable()->after('id');
        });
    }

    public function down()
    {
        Schema::table('reportes', function (Blueprint $table) {
            $table->dropColumn('codigo');
        });
    }

};
