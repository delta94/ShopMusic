import { Staff } from 'types/Staff/StaffResponse';

export interface HomeResponse {
    status: string;
    birthdayStaffs: Staff[];
    estimatedContractStaffs: Staff[];
    increaseSalaryContractStaffs: any[];
    staffs: Staff[];
}
