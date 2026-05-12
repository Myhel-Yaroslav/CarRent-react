@extends('adminlte::page')

@section('title', 'Дашборд')

@section('content_header')
    <h1>Дашборд</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="small-box bg-info">
                <div class="inner">
                    <h3>{{ $stats['total'] ?? 0 }}</h3>
                    <p>Всього авто</p>
                </div>
                <div class="icon">
                    <i class="fas fa-car"></i>
                </div>
                <a href="{{ route('admin.cars.index') }}" class="small-box-footer">Детальніше <i class="fas fa-arrow-circle-right"></i></a>
            </div>
        </div>
    </div>

    <!-- Нова секція: Активні оренди -->
    <div class="card card-warning">
        <div class="card-header">
            <h3 class="card-title"><i class="fas fa-key"></i> Активні оренди (Повернення авто)</h3>
        </div>
        <div class="card-body p-0">
            @if(isset($activeReservations) && $activeReservations->count() > 0)
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Автомобіль</th>
                            <th>Клієнт</th>
                            <th>Телефон</th>
                            <th>Дата кінця</th>
                            <th>Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($activeReservations as $res)
                            <tr>
                                <td>{{ $res->ReservationID }}</td>
                                <td>
                                    {{ $res->car->details->Brand ?? 'Невідомо' }} 
                                    {{ $res->car->details->ModelName ?? '' }} 
                                    <br>
                                    <small class="text-muted">{{ $res->NumberPlate }}</small>
                                </td>
                                <td>
                                    @if($res->user)
                                        {{ $res->user->FirstName ?? 'Гість' }} {{ $res->user->LastName ?? '' }}
                                    @else
                                        <span class="text-danger">Користувач не знайдений</span>
                                    @endif
                                </td>
                                <td>
                                    {{ $res->user->Phone ?? 'Без телефону' }}
                                </td>
                                <td>{{ \Carbon\Carbon::parse($res->DateTo)->format('d.m.Y') }}</td>
                                <td>
                                    <form action="{{ route('admin.reservations.complete', $res->ReservationID) }}" method="POST" onsubmit="return confirm('Ви впевнені, що хочете прийняти це авто?');">
                                        @csrf
                                        <button type="submit" class="btn btn-sm btn-success">
                                            <i class="fas fa-undo"></i> Прийняти авто
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div class="p-3 text-center text-muted">
                    Немає активних оренд на даний момент.
                </div>
            @endif
        </div>
    </div>
@stop
