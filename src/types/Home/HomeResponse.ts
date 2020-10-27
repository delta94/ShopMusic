import { Song } from 'types/Songs/SongResponse';
import { Staff } from 'types/Staff/StaffResponse';

export interface HomeResponse {
    status: string;
    birthdayStaffs: Staff[];
    estimatedContractStaffs: Staff[];
    increaseSalaryContractStaffs: any[];
    staffs: Staff[];
}

export interface ResponesDetailSong {
    code: number;
    message: string;
    data: Song;
}
